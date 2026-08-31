/* global process */
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, readdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, relative, resolve} from 'node:path';

const pluginId = 'org.deeptalk.mg';
const pluginVersion = '1.0.0-contract-v1';
const root = realpathSync(mkdtempSync(join(tmpdir(), 'deeptalk-mg-contract-proof-')));
const runner = 'scripts/contract-runner.js';
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const request = {
  contract_version: 'visual-asset-plugin-contract/1', request_id: 'suit-proof-001',
  opportunity: {
    opportunity_id: 'opp-proof-causal-001',
    spoken_semantics: '供应收紧会把成本压力逐步传导至终端价格。',
    visual_purpose: '解释成本压力的因果传导机制。',
    a_roll_window: {start_ms: 42_000, end_ms: 50_000}, target_duration_ms: 7_000,
    language: 'zh-CN', canvas: {width: 1920, height: 1080},
  },
};

function invoke(argumentsList, expectedStdout = '') {
  const result = spawnSync(process.execPath, [runner, ...argumentsList], {cwd: resolve('.'), encoding: 'utf8', maxBuffer: 4 * 1024 * 1024});
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, expectedStdout);
  return result;
}

function assertContained(path, outputDir) {
  const containment = relative(resolve(outputDir), resolve(path));
  assert.notEqual(containment, '..'); assert.equal(containment.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`), false);
}

function listFiles(directory) {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

function generation(runName, proposal_id) {
  const runRoot = join(root, runName); const outputDir = join(runRoot, 'artifacts');
  const requestPath = join(runRoot, 'generation-request.json'); const resultPath = join(runRoot, 'generation-result.json');
  const generationRequest = {...request, request_id: `gen-proof-${runName}`, proposal_id};
  mkdirSync(runRoot, {recursive: true});
  writeFileSync(requestPath, JSON.stringify(generationRequest));
  invoke(['--request', requestPath, '--result', resultPath, '--output-dir', outputDir]);
  const result = JSON.parse(readFileSync(resultPath, 'utf8'));
  assert.equal(result.contract_version, request.contract_version);
  assert.equal(result.request_id, generationRequest.request_id);
  assert.equal(result.opportunity_id, request.opportunity.opportunity_id);
  assert.equal(result.proposal_id, proposal_id);
  assert.equal(result.plugin_id, pluginId);
  assert.equal(result.plugin_version, pluginVersion);
  assert.equal(result.operation_status, 'COMPLETED');
  assert.equal(result.candidate.candidate_status, 'READY');
  assert.equal(result.candidate.qa.status, 'PASSED');
  assert.equal(result.candidate.provenance.origin, 'plugin-generated');
  assert.ok(result.candidate.suggested_placement.start_ms >= request.opportunity.a_roll_window.start_ms);
  assert.ok(result.candidate.suggested_placement.end_ms <= request.opportunity.a_roll_window.end_ms);
  const primary = result.candidate.artifacts.find((artifact) => artifact.role === 'PRIMARY_MEDIA');
  assert.deepEqual(primary.uri, 'local-runner://scene.mp4'); assert.equal(primary.media_type, 'video/mp4');
  const mediaPath = join(outputDir, 'scene.mp4'); const manifestPath = join(outputDir, 'manifest.json'); const qaPath = join(outputDir, 'qa.json');
  for (const path of [mediaPath, manifestPath, qaPath]) { assert.ok(existsSync(path)); assertContained(path, outputDir); }
  for (const path of listFiles(outputDir)) assertContained(path, outputDir);
  assert.equal(primary.sha256, sha256(mediaPath));
  assert.equal(primary.duration_ms, result.candidate.duration_ms);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')); const qa = JSON.parse(readFileSync(qaPath, 'utf8'));
  assert.equal(manifest.plugin_id, pluginId); assert.equal(manifest.plugin_version, pluginVersion);
  assert.equal(manifest.media.sha256, primary.sha256); assert.equal(manifest.media.duration_ms, primary.duration_ms);
  assert.equal(qa.status, 'PASSED'); assert.equal(qa.checks.sha256, primary.sha256);
  return {result, sha: primary.sha256, mediaPath, manifest, qa, primary};
}

const version = invoke(['--version'], `${pluginVersion}\n`).stdout.trim();
const suitabilityRequestPath = join(root, 'suitability-request.json'); const suitabilityResultPath = join(root, 'suitability-result.json');
writeFileSync(suitabilityRequestPath, JSON.stringify(request));
invoke(['--request', suitabilityRequestPath, '--result', suitabilityResultPath, '--output-dir', join(root, 'suitability-artifacts')]);
const suitability = JSON.parse(readFileSync(suitabilityResultPath, 'utf8'));
assert.equal(suitability.operation_status, 'COMPLETED'); assert.equal(suitability.suitability, 'SUITABLE');
assert.equal(suitability.plugin_id, pluginId); assert.equal(suitability.plugin_version, version);
const first = generation('run-a', suitability.proposal_id);
const second = generation('run-b', suitability.proposal_id);
assert.equal(first.result.proposal_id, second.result.proposal_id);
assert.equal(first.result.candidate.candidate_id, second.result.candidate.candidate_id);
assert.equal(first.sha, second.sha);
assert.ok(readFileSync(first.mediaPath).equals(readFileSync(second.mediaPath)));
process.stdout.write([
  'canonical command: node scripts/contract-runner.js',
  'version command: node scripts/contract-runner.js --version',
  `plugin_id: ${pluginId}`,
  `plugin_version: ${version}`,
  `proposal_id run1: ${first.result.proposal_id}`,
  `proposal_id run2: ${second.result.proposal_id}`,
  `candidate_id run1: ${first.result.candidate.candidate_id}`,
  `candidate_id run2: ${second.result.candidate.candidate_id}`,
  `PRIMARY_MEDIA SHA-256 run1: ${first.sha}`,
  `PRIMARY_MEDIA SHA-256 run2: ${second.sha}`,
  'binary equality: true',
  `actual duration_ms: ${first.primary.duration_ms}`,
  `artifact URI: ${first.primary.uri}`,
  `manifest: ${first.manifest.artifact_version} ${first.manifest.plugin_id} ${first.manifest.plugin_version}`,
  `QA: ${first.qa.artifact_version} ${first.qa.status}`,
].join('\n') + '\n');
