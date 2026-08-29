import {closeSync, existsSync, fsyncSync, lstatSync, mkdirSync, openSync, readFileSync, renameSync, writeSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {dirname, resolve} from 'node:path';
import {
  CONTRACT_VERSION, PLUGIN_VERSION, assessSuitability, blockedGenerationResult, buildQaRejectedGenerationResult, buildReadyGenerationResult,
  compileOpportunity, failedGenerationResult, proposalId, suitabilityFor, unavailableGenerationResult, validateRequest, type GenerationRequest,
} from '../src/contract-runner';
import {validateRunnerMediaQa} from '../src/qa';

type Args = {request?: string; result?: string; outputDir?: string; version: boolean};

const usage = 'usage: contract:runner --request <path> --result <path> --output-dir <path> | --version';

function parseArgs(argv: string[]): Args {
  const args: Args = {version: false};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--version') { args.version = true; continue; }
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) throw new Error(usage);
    if (value === '--request') args.request = next;
    else if (value === '--result') args.result = next;
    else if (value === '--output-dir') args.outputDir = next;
    else throw new Error(usage);
    index += 1;
  }
  if (args.version && (args.request || args.result || args.outputDir)) throw new Error(usage);
  if (!args.version && (!args.request || !args.result || !args.outputDir)) throw new Error(usage);
  return args;
}

export function ensureArtifactPath(outputDir: string, relativePath: string): string {
  if (!relativePath || relativePath.startsWith('/') || relativePath.split(/[\\/]/).includes('..')) throw new Error('artifact path must remain beneath output-dir');
  const root = resolve(outputDir); const target = resolve(root, relativePath);
  if (target !== root && !target.startsWith(`${root}/`)) throw new Error('artifact path must remain beneath output-dir');
  if (lstatSync(root).isSymbolicLink()) throw new Error('output-dir must not be a symbolic link');
  let current = root;
  for (const segment of relativePath.split(/[\\/]/)) {
    current = resolve(current, segment);
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) throw new Error('artifact path must not traverse a symbolic link');
  }
  return target;
}

export function writeAtomicJson(resultPath: string, value: unknown): void {
  const target = resolve(resultPath); const parent = dirname(target); mkdirSync(parent, {recursive: true});
  const temporary = `${target}.tmp-${process.pid}-${Date.now()}`;
  const descriptor = openSync(temporary, 'w', 0o600);
  try {
    writeSync(descriptor, `${JSON.stringify(value, null, 2)}\n`);
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
  renameSync(temporary, target);
}

const chrome = process.env.DEEPTALK_MG_CHROME_EXECUTABLE ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const fileSha256 = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const parseRate = (value: string) => { const [numerator, denominator] = value.split('/').map(Number); return denominator ? numerator / denominator : numerator; };

function runnerFailureMessage(command: string, result: ReturnType<typeof spawnSync>): string {
  const stderr = typeof result.stderr === 'string' ? result.stderr : '';
  return `${command} failed${stderr ? `: ${stderr.trim()}` : ''}`.slice(0, 500);
}

function renderGeneration(request: GenerationRequest, outputDir: string) {
  const mediaPath = ensureArtifactPath(outputDir, 'scene.mp4');
  const manifestPath = ensureArtifactPath(outputDir, 'manifest.json');
  const qaPath = ensureArtifactPath(outputDir, 'qa.json');
  const propsPath = ensureArtifactPath(outputDir, 'contract-props.json');
  if ([mediaPath, manifestPath, qaPath, propsPath].some(existsSync)) throw new Error('output-dir already contains Contract runner artifact names');
  if (!existsSync(chrome)) throw new Error(`Chrome executable is unavailable: ${chrome}`);
  const scene = compileOpportunity(request.opportunity);
  ensureArtifactPath(outputDir, 'contract-props.json'); writeAtomicJson(propsPath, {scene});
  ensureArtifactPath(outputDir, 'scene.mp4');
  const render = spawnSync('npx', ['--no-install', 'remotion', 'render', 'src/index.ts', 'ContractDynamic', mediaPath, `--props=${propsPath}`, `--browser-executable=${chrome}`, '--concurrency=1', '--gl=swiftshader', '--log=error', '--codec=h264'], {encoding: 'utf8'});
  if (render.status !== 0) throw new Error(runnerFailureMessage('Remotion render', render));
  const probe = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate,duration', '-of', 'json', mediaPath], {encoding: 'utf8'});
  if (probe.status !== 0) throw new Error(runnerFailureMessage('ffprobe', probe));
  const stream = JSON.parse(probe.stdout).streams?.[0];
  if (!stream) throw new Error('ffprobe did not report a video stream');
  const sha256 = fileSha256(mediaPath); const durationSeconds = Number(stream.duration);
  const media = {duration_ms: Math.round(durationSeconds * 1000), sha256};
  let qaStatus: 'PASSED' | 'FAILED' = 'PASSED'; let qaProblem = '';
  try { validateRunnerMediaQa({width: stream.width, height: stream.height, fps: parseRate(stream.r_frame_rate), durationSeconds, sha256}); }
  catch (error) { qaStatus = 'FAILED'; qaProblem = error instanceof Error ? error.message : 'media QA failed'; }
  const result = qaStatus === 'PASSED' ? buildReadyGenerationResult(request, media) : buildQaRejectedGenerationResult(request, media, qaProblem);
  ensureArtifactPath(outputDir, 'manifest.json'); writeAtomicJson(manifestPath, {artifact_version: 'deeptalk-mg-manifest/1', plugin_id: result.plugin_id, plugin_version: result.plugin_version, compiler_semantics: result.candidate.plugin_metadata.compiler_semantics, scene, media: {path: 'scene.mp4', sha256, duration_ms: result.candidate.duration_ms, width: stream.width, height: stream.height, fps: parseRate(stream.r_frame_rate)}});
  ensureArtifactPath(outputDir, 'qa.json'); writeAtomicJson(qaPath, {artifact_version: 'deeptalk-mg-qa/1', status: qaStatus, checks: {width: stream.width, height: stream.height, fps: parseRate(stream.r_frame_rate), duration_ms: result.candidate.duration_ms, sha256}, ...(qaProblem ? {problem: qaProblem} : {})});
  return result;
}

export function main(argv = process.argv.slice(2)): void {
  const args = parseArgs(argv);
  if (args.version) {
    process.stdout.write(`${PLUGIN_VERSION}\n`);
    return;
  }
  const outputDir = resolve(args.outputDir!); mkdirSync(outputDir, {recursive: true});
  const requestRaw = readFileSync(resolve(args.request!), 'utf8');
  let request: Record<string, unknown>;
  try { request = JSON.parse(requestRaw) as Record<string, unknown>; } catch { throw new Error('request must be valid JSON'); }
  if (request.contract_version !== CONTRACT_VERSION) throw new Error(`contract_version must be ${CONTRACT_VERSION}`);
  const validated = validateRequest(request);
  if ('proposal_id' in validated) {
    if (validated.proposal_id !== proposalId(validated.opportunity)) {
      writeAtomicJson(args.result!, blockedGenerationResult(validated, 'PROPOSAL_MISMATCH', 'proposal_id does not match the current opportunity, plugin version, and compiler semantics'));
      return;
    }
    if (suitabilityFor(validated.opportunity).suitability !== 'SUITABLE') {
      writeAtomicJson(args.result!, blockedGenerationResult(validated, 'UNSUPPORTED_OPPORTUNITY', 'generation is currently implemented only for causal and mechanism transmission opportunities'));
      return;
    }
    if (!existsSync(chrome)) {
      writeAtomicJson(args.result!, unavailableGenerationResult(validated, 'RENDERER_UNAVAILABLE', `Chrome executable is unavailable: ${chrome}`));
      return;
    }
    try {
      writeAtomicJson(args.result!, renderGeneration(validated, outputDir));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'generation failed';
      writeAtomicJson(args.result!, failedGenerationResult(validated, 'GENERATION_FAILED', message.slice(0, 500)));
    }
    return;
  }
  writeAtomicJson(args.result!, assessSuitability(validated));
}
