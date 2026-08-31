import {existsSync, mkdtempSync, readFileSync, realpathSync, readdirSync, symlinkSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {describe, expect, it} from 'vitest';
import {
  CONTRACT_VERSION,
  PLUGIN_ID,
  PLUGIN_VERSION,
  assessSuitability,
  buildReadyGenerationResult,
  buildQaRejectedGenerationResult,
  unavailableGenerationResult,
  compileOpportunity,
  validateRequest,
} from '../src/contract-runner';
import {ensureArtifactPath, writeAtomicJson} from '../scripts/contract-runner.ts';

const temporaryDirectory = (prefix: string) => realpathSync(mkdtempSync(join(tmpdir(), prefix)));

const opportunity = {
  opportunity_id: 'opp-causal-001',
  spoken_semantics: '库存收紧把采购压力逐步传导至终端价格。',
  visual_purpose: '解释因果传导机制。',
  a_roll_window: {start_ms: 10_000, end_ms: 18_000},
  target_duration_ms: 7_000,
  language: 'zh-CN',
  canvas: {width: 1920, height: 1080},
};

describe('Visual Asset Plugin Contract V1 suitability', () => {
  it('publishes the fixed contract plugin identity', () => {
    expect(CONTRACT_VERSION).toBe('visual-asset-plugin-contract/1');
    expect(PLUGIN_ID).toBe('org.deeptalk.mg');
    expect(PLUGIN_VERSION).toBe('1.0.0-contract-v1');
  });

  it('returns a deterministic causal proposal independent of request correlation', () => {
    const first = assessSuitability({contract_version: CONTRACT_VERSION, request_id: 'suit-1', opportunity});
    const second = assessSuitability({contract_version: CONTRACT_VERSION, request_id: 'suit-2', opportunity});

    expect(first).toMatchObject({
      contract_version: CONTRACT_VERSION,
      request_id: 'suit-1',
      opportunity_id: 'opp-causal-001',
      plugin_id: PLUGIN_ID,
      plugin_version: PLUGIN_VERSION,
      operation_status: 'COMPLETED',
      suitability: 'SUITABLE',
    });
    expect(second.proposal_id).toBe(first.proposal_id);
  });

  it('treats broad conceptual copy as borderline and numeric evidence as an abstention', () => {
    const borderline = assessSuitability({
      contract_version: CONTRACT_VERSION,
      request_id: 'suit-borderline',
      opportunity: {...opportunity, opportunity_id: 'opp-general', spoken_semantics: '团队需要持续提高协同效率。', visual_purpose: '概括工作方向。'},
    });
    const abstain = assessSuitability({
      contract_version: CONTRACT_VERSION,
      request_id: 'suit-abstain',
      opportunity: {...opportunity, opportunity_id: 'opp-numeric', spoken_semantics: '本季度收入增长 12.4%。', visual_purpose: '展示准确数值。'},
    });

    expect(borderline.suitability).toBe('BORDERLINE');
    expect(abstain.suitability).toBe('ABSTAIN');
  });

  it('rejects malformed request JSON and an unsupported opportunity shape', () => {
    expect(() => validateRequest('{bad json')).toThrow('valid JSON');
    expect(() => validateRequest({contract_version: 'visual-asset-plugin-contract/2', request_id: 'bad', opportunity})).toThrow('contract_version');
    expect(() => validateRequest({contract_version: CONTRACT_VERSION, request_id: 'bad-window', opportunity: {...opportunity, a_roll_window: {start_ms: 8_000, end_ms: 8_000}}})).toThrow('a_roll_window');
  });

  it('compiles request text to a fresh validated causal mg-scene rather than a benchmark lookup', () => {
    const first = compileOpportunity(opportunity);
    const second = compileOpportunity({...opportunity, spoken_semantics: '成本上升经由渠道逐步传递给消费者。'});

    expect(first).toMatchObject({sceneVersion: 'mg-scene/1', benchmarkKind: 'causal-chain', profile: 'editorial-cn-v1', grammar: 'causal-flow', durationSeconds: 7});
    expect(first.id).not.toBe('causal-chain');
    expect(second.primaryJudgment).toBe('成本上升经由渠道逐步传递给消费者。');
    expect(second.primaryJudgment).not.toBe(first.primaryJudgment);
  });
});

describe('contract runner CLI', () => {
  const run = (args: string[], env = process.env) => spawnSync(
    process.execPath,
    ['scripts/contract-runner.js', ...args],
    {cwd: resolve('.'), encoding: 'utf8', env},
  );

  it('prints only its stable plugin version for --version', () => {
    const result = run(['--version']);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(PLUGIN_VERSION);
    expect(result.stderr).toBe('');
  });

  it('writes a completed suitability response to the caller result path', () => {
    const root = temporaryDirectory('deeptalk-mg-contract-');
    const request = join(root, 'request.json'); const result = join(root, 'result.json');
    writeFileSync(request, JSON.stringify({contract_version: CONTRACT_VERSION, request_id: 'suit-cli', opportunity}));

    const process = run(['--request', request, '--result', result, '--output-dir', join(root, 'artifacts')]);
    expect(process.status).toBe(0);
    expect(process.stdout).toBe('');
    expect(JSON.parse(readFileSync(result, 'utf8'))).toMatchObject({
      request_id: 'suit-cli', plugin_id: 'org.deeptalk.mg', plugin_version: '1.0.0-contract-v1',
      operation_status: 'COMPLETED', suitability: 'SUITABLE',
    });
  });

  it.each([
    ['BORDERLINE', '团队需要持续提高协同效率。', '概括工作方向。'],
    ['ABSTAIN', '本季度收入增长 12.4%。', '展示准确数值。'],
  ])('returns canonical %s suitability through the Node entrypoint', (expected, spoken_semantics, visual_purpose) => {
    const root = temporaryDirectory('deeptalk-mg-contract-');
    const request = join(root, 'request.json'); const result = join(root, 'result.json');
    writeFileSync(request, JSON.stringify({
      contract_version: CONTRACT_VERSION, request_id: `suit-${expected.toLowerCase()}`,
      opportunity: {...opportunity, opportunity_id: `opp-${expected.toLowerCase()}`, spoken_semantics, visual_purpose},
    }));

    const process = run(['--request', request, '--result', result, '--output-dir', join(root, 'artifacts')]);

    expect(process.status).toBe(0);
    expect(process.stdout).toBe('');
    expect(JSON.parse(readFileSync(result, 'utf8'))).toMatchObject({
      plugin_id: 'org.deeptalk.mg', plugin_version: '1.0.0-contract-v1',
      operation_status: 'COMPLETED', suitability: expected,
    });
  });

  it('rejects invalid request JSON without writing outside the supplied artifact root', () => {
    const root = temporaryDirectory('deeptalk-mg-contract-');
    const request = join(root, 'invalid.json'); const result = join(root, 'result.json'); const output = join(root, 'artifacts');
    writeFileSync(request, '{invalid');

    const process = run(['--request', request, '--result', result, '--output-dir', output]);
    expect(process.status).toBe(1);
    expect(process.stderr).toContain('valid JSON');
  });

  it('rejects an artifact path traversal before a renderer can write it', () => {
    const root = temporaryDirectory('deeptalk-mg-contract-root-');
    expect(() => ensureArtifactPath(root, '../outside.mp4')).toThrow('beneath output-dir');
    expect(() => ensureArtifactPath(root, '/tmp/outside.mp4')).toThrow('beneath output-dir');
  });

  it('rejects a symlinked artifact parent before a renderer can escape the output root', () => {
    const root = temporaryDirectory('deeptalk-mg-contract-root-'); const outside = temporaryDirectory('deeptalk-mg-contract-outside-');
    symlinkSync(outside, join(root, 'linked-output'));
    expect(() => ensureArtifactPath(root, 'linked-output/scene.mp4')).toThrow('symbolic link');
  });

  it('rejects a symlink supplied as the canonical output root', () => {
    const root = temporaryDirectory('deeptalk-mg-contract-root-');
    const outside = temporaryDirectory('deeptalk-mg-contract-outside-');
    const request = join(root, 'request.json'); const result = join(root, 'result.json'); const output = join(root, 'output-link');
    symlinkSync(outside, output);
    writeFileSync(request, JSON.stringify({contract_version: CONTRACT_VERSION, request_id: 'suit-root-link', opportunity}));

    const process = run(['--request', request, '--result', result, '--output-dir', output]);

    expect(process.status).not.toBe(0);
    expect(process.stderr).toContain('symbolic link');
    expect(existsSync(result)).toBe(false);
  });

  it('rejects an existing symlink ancestor before creating an output directory outside the lexical root', () => {
    const root = temporaryDirectory('deeptalk-mg-contract-root-');
    const outside = temporaryDirectory('deeptalk-mg-contract-outside-');
    const request = join(root, 'request.json'); const result = join(root, 'result.json'); const alias = join(root, 'alias');
    symlinkSync(outside, alias);
    writeFileSync(request, JSON.stringify({contract_version: CONTRACT_VERSION, request_id: 'suit-ancestor-link', opportunity}));

    const process = run(['--request', request, '--result', result, '--output-dir', join(alias, 'artifacts')]);

    expect(process.status).not.toBe(0);
    expect(process.stderr).toContain('symbolic link');
    expect(existsSync(join(outside, 'artifacts'))).toBe(false);
    expect(existsSync(result)).toBe(false);
  });

  it('atomically replaces a complete result without leaving a temporary file', () => {
    const root = temporaryDirectory('deeptalk-mg-contract-atomic-'); const result = join(root, 'result.json');
    writeFileSync(result, '{"old":true}\n');
    writeAtomicJson(result, {contract_version: CONTRACT_VERSION, operation_status: 'COMPLETED'});
    expect(JSON.parse(readFileSync(result, 'utf8'))).toEqual({contract_version: CONTRACT_VERSION, operation_status: 'COMPLETED'});
    expect(readdirSync(root).some((name) => name.includes('.tmp-'))).toBe(false);
  });

  it('atomically replaces the canonical CLI result without transport stdout or temporary files', () => {
    const root = temporaryDirectory('deeptalk-mg-contract-atomic-cli-');
    const request = join(root, 'request.json'); const result = join(root, 'result.json');
    writeFileSync(request, JSON.stringify({contract_version: CONTRACT_VERSION, request_id: 'suit-atomic', opportunity}));
    writeFileSync(result, '{"old":true}\n');

    const process = run(['--request', request, '--result', result, '--output-dir', join(root, 'artifacts')]);

    expect(process.status).toBe(0);
    expect(process.stdout).toBe('');
    expect(JSON.parse(readFileSync(result, 'utf8'))).toMatchObject({request_id: 'suit-atomic', operation_status: 'COMPLETED'});
    expect(readdirSync(root).some((name) => name.includes('.tmp-'))).toBe(false);
  });

  it('returns a legal blocked result for a generation proposal that does not match the current opportunity', () => {
    const root = temporaryDirectory('deeptalk-mg-contract-');
    const request = join(root, 'request.json'); const result = join(root, 'result.json');
    writeFileSync(request, JSON.stringify({contract_version: CONTRACT_VERSION, request_id: 'gen-mismatch', proposal_id: 'prop_wrong', opportunity}));

    const process = run(['--request', request, '--result', result, '--output-dir', join(root, 'artifacts')]);
    expect(process.status).toBe(0);
    expect(JSON.parse(readFileSync(result, 'utf8'))).toMatchObject({
      request_id: 'gen-mismatch', opportunity_id: opportunity.opportunity_id, proposal_id: 'prop_wrong',
      plugin_id: 'org.deeptalk.mg', plugin_version: '1.0.0-contract-v1',
      operation_status: 'BLOCKED', problem: {code: 'PROPOSAL_MISMATCH'},
    });
  });

  it('returns a legal unavailable generation result when the local renderer is unavailable', () => {
    const root = temporaryDirectory('deeptalk-mg-contract-');
    const request = join(root, 'request.json'); const result = join(root, 'result.json');
    const proposal_id = assessSuitability({contract_version: CONTRACT_VERSION, request_id: 'suit-unavailable', opportunity}).proposal_id;
    writeFileSync(request, JSON.stringify({contract_version: CONTRACT_VERSION, request_id: 'gen-unavailable', proposal_id, opportunity}));

    const child = run(
      ['--request', request, '--result', result, '--output-dir', join(root, 'artifacts')],
      {...process.env, DEEPTALK_MG_CHROME_EXECUTABLE: join(root, 'missing-chrome')},
    );
    expect(child.status).toBe(0);
    const unavailable = JSON.parse(readFileSync(result, 'utf8'));
    expect(unavailable).toMatchObject({operation_status: 'UNAVAILABLE', problem: {code: 'RENDERER_UNAVAILABLE'}});
    expect(unavailable).not.toHaveProperty('candidate');
  });
});

describe('generation result construction', () => {
  it('creates one deterministic ready candidate with contained local-runner artifacts', () => {
    const request = {contract_version: CONTRACT_VERSION, request_id: 'gen-ready', proposal_id: assessSuitability({contract_version: CONTRACT_VERSION, request_id: 'suit-ready', opportunity}).proposal_id, opportunity} as const;
    const result = buildReadyGenerationResult(request, {duration_ms: 7000, sha256: 'b'.repeat(64)});

    expect(result).toMatchObject({
      request_id: 'gen-ready', proposal_id: request.proposal_id, operation_status: 'COMPLETED',
      candidate: {
        asset_family: 'MG', candidate_status: 'READY', duration_ms: 7000,
        suggested_placement: {start_ms: 10_000, end_ms: 17_000},
        qa: {status: 'PASSED'}, provenance: {origin: 'plugin-generated'},
      },
    });
    expect(result.candidate.artifacts).toEqual(expect.arrayContaining([
      expect.objectContaining({role: 'PRIMARY_MEDIA', uri: 'local-runner://scene.mp4', media_type: 'video/mp4', sha256: 'b'.repeat(64), duration_ms: 7000}),
      expect.objectContaining({role: 'MANIFEST', uri: 'local-runner://manifest.json'}),
      expect.objectContaining({role: 'QA_REPORT', uri: 'local-runner://qa.json'}),
    ]));
    expect(buildReadyGenerationResult({...request, request_id: 'gen-ready-2'}, {duration_ms: 7000, sha256: 'b'.repeat(64)}).candidate.candidate_id).toBe(result.candidate.candidate_id);
  });

  it('preserves an actual media candidate as QA_REJECTED when plugin QA fails', () => {
    const request = {contract_version: CONTRACT_VERSION, request_id: 'gen-qa-failed', proposal_id: assessSuitability({contract_version: CONTRACT_VERSION, request_id: 'suit-qa-failed', opportunity}).proposal_id, opportunity} as const;
    const result = buildQaRejectedGenerationResult(request, {duration_ms: 7000, sha256: 'c'.repeat(64)}, 'fps must be 30');

    expect(result).toMatchObject({operation_status: 'COMPLETED', candidate: {candidate_status: 'QA_REJECTED', qa: {status: 'FAILED', summary: 'fps must be 30'}}});
    expect(result.candidate.artifacts).toEqual(expect.arrayContaining([expect.objectContaining({role: 'PRIMARY_MEDIA', sha256: 'c'.repeat(64)})]));
  });

  it('builds an unavailable result without a produced candidate', () => {
    const request = {contract_version: CONTRACT_VERSION, request_id: 'gen-unavailable-shape', proposal_id: assessSuitability({contract_version: CONTRACT_VERSION, request_id: 'suit-unavailable-shape', opportunity}).proposal_id, opportunity} as const;
    const result = unavailableGenerationResult(request, 'RENDERER_UNAVAILABLE', 'Chrome is unavailable');
    expect(result).toMatchObject({operation_status: 'UNAVAILABLE', problem: {code: 'RENDERER_UNAVAILABLE'}});
    expect(result).not.toHaveProperty('candidate');
  });
});
