import {createHash} from 'node:crypto';
import {validateScene, type MgScene} from './model';

export const CONTRACT_VERSION = 'visual-asset-plugin-contract/1';
export const PLUGIN_ID = 'deeptalk-mg';
export const PLUGIN_VERSION = '1.0.0-contract-v1';
export const COMPILER_SEMANTICS = 'causal-flow/compiler-v1';
export const SUITABILITY_OPERATION_STATUSES = ['COMPLETED', 'FAILED', 'UNAVAILABLE'] as const;
export const GENERATION_OPERATION_STATUSES = ['COMPLETED', 'FAILED', 'BLOCKED', 'UNAVAILABLE'] as const;

type JsonObject = Record<string, unknown>;
export type Opportunity = {
  opportunity_id: string;
  spoken_semantics: string;
  visual_purpose: string;
  a_roll_window: {start_ms: number; end_ms: number};
  target_duration_ms: number;
  language: string;
  canvas: {width: number; height: number};
  semantic_context?: string;
  factual_context?: unknown[];
  plugin_context?: unknown;
};
export type SuitabilityRequest = {contract_version: typeof CONTRACT_VERSION; request_id: string; opportunity: Opportunity};
export type GenerationRequest = SuitabilityRequest & {proposal_id: string};
export type Suitability = 'SUITABLE' | 'BORDERLINE' | 'ABSTAIN';
export type SuitabilityResponse = {
  contract_version: typeof CONTRACT_VERSION;
  request_id: string;
  opportunity_id: string;
  plugin_id: typeof PLUGIN_ID;
  plugin_version: typeof PLUGIN_VERSION;
  proposal_id: string;
  operation_status: 'COMPLETED';
  suitability: Suitability;
  reason: string;
};
export type SuitabilityFailureResponse = {
  contract_version: typeof CONTRACT_VERSION;
  request_id: string;
  opportunity_id: string;
  plugin_id: typeof PLUGIN_ID;
  plugin_version: typeof PLUGIN_VERSION;
  operation_status: 'FAILED' | 'UNAVAILABLE';
  problem: {code: string; message: string; retryability: boolean};
};
export type SuitabilityResult = SuitabilityResponse | SuitabilityFailureResponse;
export type GenerationResult = {
  contract_version: typeof CONTRACT_VERSION;
  request_id: string;
  opportunity_id: string;
  proposal_id: string;
  plugin_id: typeof PLUGIN_ID;
  plugin_version: typeof PLUGIN_VERSION;
  operation_status: 'COMPLETED' | 'FAILED' | 'BLOCKED' | 'UNAVAILABLE';
  candidate?: {
    candidate_id: string;
    asset_family: 'MG';
    candidate_status: 'READY' | 'QA_REJECTED';
    duration_ms: number;
    suggested_placement: {start_ms: number; end_ms: number};
    artifacts: Array<{role: 'PRIMARY_MEDIA' | 'MANIFEST' | 'QA_REPORT'; uri: string; media_type?: string; sha256?: string; duration_ms?: number}>;
    qa: {status: 'PASSED' | 'FAILED'; summary: string};
    provenance: {origin: 'plugin-generated'; source_ref: string};
    plugin_metadata: {scene_version: 'mg-scene/1'; compiler_semantics: typeof COMPILER_SEMANTICS};
  };
  problem?: {code: string; message: string; retryability: boolean};
};

const object = (value: unknown, name: string): JsonObject => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${name} must be an object`);
  return value as JsonObject;
};
const only = (value: JsonObject, allowed: string[], name: string) => {
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key));
  if (unknown.length) throw new Error(`${name} contains unknown fields: ${unknown.join(', ')}`);
};
const text = (value: unknown, name: string): string => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} must be non-empty text`);
  return value;
};
const positiveInt = (value: unknown, name: string): number => {
  if (!Number.isInteger(value) || (value as number) <= 0) throw new Error(`${name} must be a positive integer`);
  return value as number;
};
const nonnegativeInt = (value: unknown, name: string): number => {
  if (!Number.isInteger(value) || (value as number) < 0) throw new Error(`${name} must be a non-negative integer`);
  return value as number;
};

function validateOpportunity(value: unknown): Opportunity {
  const data = object(value, 'opportunity');
  only(data, ['opportunity_id', 'spoken_semantics', 'visual_purpose', 'a_roll_window', 'target_duration_ms', 'language', 'canvas', 'semantic_context', 'factual_context', 'plugin_context'], 'opportunity');
  const window = object(data.a_roll_window, 'a_roll_window'); only(window, ['start_ms', 'end_ms'], 'a_roll_window');
  const start_ms = nonnegativeInt(window.start_ms, 'a_roll_window.start_ms');
  const end_ms = nonnegativeInt(window.end_ms, 'a_roll_window.end_ms');
  if (start_ms >= end_ms) throw new Error('a_roll_window must satisfy start_ms < end_ms');
  const canvas = object(data.canvas, 'canvas'); only(canvas, ['width', 'height'], 'canvas');
  const result: Opportunity = {
    opportunity_id: text(data.opportunity_id, 'opportunity_id'),
    spoken_semantics: text(data.spoken_semantics, 'spoken_semantics'),
    visual_purpose: text(data.visual_purpose, 'visual_purpose'),
    a_roll_window: {start_ms, end_ms},
    target_duration_ms: positiveInt(data.target_duration_ms, 'target_duration_ms'),
    language: text(data.language, 'language'),
    canvas: {width: positiveInt(canvas.width, 'canvas.width'), height: positiveInt(canvas.height, 'canvas.height')},
  };
  if (data.semantic_context !== undefined) result.semantic_context = text(data.semantic_context, 'semantic_context');
  if (data.factual_context !== undefined) {
    if (!Array.isArray(data.factual_context)) throw new Error('factual_context must be a list');
    result.factual_context = data.factual_context;
  }
  if (data.plugin_context !== undefined) result.plugin_context = data.plugin_context;
  return result;
}

export function validateRequest(raw: unknown): SuitabilityRequest | GenerationRequest {
  const parsed = typeof raw === 'string' ? (() => { try { return JSON.parse(raw); } catch { throw new Error('request must be valid JSON'); } })() : raw;
  const data = object(parsed, 'request');
  const generation = Object.hasOwn(data, 'proposal_id');
  only(data, generation ? ['contract_version', 'request_id', 'proposal_id', 'opportunity'] : ['contract_version', 'request_id', 'opportunity'], 'request');
  if (data.contract_version !== CONTRACT_VERSION) throw new Error(`contract_version must be ${CONTRACT_VERSION}`);
  const base: SuitabilityRequest = {contract_version: CONTRACT_VERSION, request_id: text(data.request_id, 'request_id'), opportunity: validateOpportunity(data.opportunity)};
  return generation ? {...base, proposal_id: text(data.proposal_id, 'proposal_id')} : base;
}

const canonicalize = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (value && typeof value === 'object') {
    const data = value as JsonObject;
    return `{${Object.keys(data).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(data[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
};
const digest = (value: unknown) => createHash('sha256').update(canonicalize(value)).digest('hex');

export function suitabilityFor(opportunity: Opportunity): {suitability: Suitability; reason: string} {
  const source = `${opportunity.spoken_semantics} ${opportunity.visual_purpose}`;
  if (/\d|百分之|增长|下降|收入|数值|比例/.test(source)) return {suitability: 'ABSTAIN', reason: 'MG 当前没有经验证的动态数值证据 grammar，避免把精确数值伪装成机制图。'};
  if (/因果|传导|导致|因为|因此|机制|压力|影响|经由|逐步|链/.test(source)) return {suitability: 'SUITABLE', reason: 'MG 的 causal-flow grammar 能以受控的压力传导结构解释该因果机制。'};
  return {suitability: 'BORDERLINE', reason: 'MG 可以形成概念性编辑图形，但当前已验证 grammar 不能自然保证该语义的精确表达。'};
}

export function proposalId(opportunity: Opportunity): string {
  return `prop_${digest({plugin_id: PLUGIN_ID, plugin_version: PLUGIN_VERSION, compiler_semantics: COMPILER_SEMANTICS, opportunity}).slice(0, 24)}`;
}

export function assessSuitability(raw: unknown): SuitabilityResponse {
  const request = validateRequest(raw);
  if ('proposal_id' in request) throw new Error('suitability request must not include proposal_id');
  const {suitability, reason} = suitabilityFor(request.opportunity);
  return {
    contract_version: CONTRACT_VERSION,
    request_id: request.request_id,
    opportunity_id: request.opportunity.opportunity_id,
    plugin_id: PLUGIN_ID,
    plugin_version: PLUGIN_VERSION,
    proposal_id: proposalId(request.opportunity),
    operation_status: 'COMPLETED',
    suitability,
    reason,
  };
}

export function compileOpportunity(opportunity: Opportunity): MgScene {
  const supports = [opportunity.visual_purpose, ...(opportunity.semantic_context ? [opportunity.semantic_context] : [])]
    .map((item) => item.trim()).filter(Boolean).slice(0, 5);
  if (!supports.length) supports.push('从触发因素到累积后果的传导过程。');
  return validateScene({
    sceneVersion: 'mg-scene/1',
    id: `contract-${digest({compiler_semantics: COMPILER_SEMANTICS, opportunity}).slice(0, 24)}`,
    benchmarkKind: 'causal-chain',
    profile: 'editorial-cn-v1',
    grammar: 'causal-flow',
    durationSeconds: 7,
    primaryJudgment: opportunity.spoken_semantics,
    supporting: supports,
  });
}

export function blockedGenerationResult(request: GenerationRequest, code: string, message: string): GenerationResult {
  return {
    contract_version: CONTRACT_VERSION, request_id: request.request_id, opportunity_id: request.opportunity.opportunity_id,
    proposal_id: request.proposal_id, plugin_id: PLUGIN_ID, plugin_version: PLUGIN_VERSION, operation_status: 'BLOCKED',
    problem: {code, message, retryability: false},
  };
}

export function failedGenerationResult(request: GenerationRequest, code: string, message: string): GenerationResult {
  return {
    contract_version: CONTRACT_VERSION, request_id: request.request_id, opportunity_id: request.opportunity.opportunity_id,
    proposal_id: request.proposal_id, plugin_id: PLUGIN_ID, plugin_version: PLUGIN_VERSION, operation_status: 'FAILED',
    problem: {code, message, retryability: false},
  };
}

export function unavailableGenerationResult(request: GenerationRequest, code: string, message: string): GenerationResult {
  return {
    contract_version: CONTRACT_VERSION, request_id: request.request_id, opportunity_id: request.opportunity.opportunity_id,
    proposal_id: request.proposal_id, plugin_id: PLUGIN_ID, plugin_version: PLUGIN_VERSION, operation_status: 'UNAVAILABLE',
    problem: {code, message, retryability: true},
  };
}

export function buildReadyGenerationResult(request: GenerationRequest, media: {duration_ms: number; sha256: string}): GenerationResult & {operation_status: 'COMPLETED'; candidate: NonNullable<GenerationResult['candidate']>} {
  if (request.proposal_id !== proposalId(request.opportunity)) throw new Error('proposal_id does not match opportunity');
  if (!Number.isInteger(media.duration_ms) || media.duration_ms <= 0) throw new Error('media duration must be positive');
  if (!/^[a-f0-9]{64}$/.test(media.sha256)) throw new Error('media sha256 must be valid');
  const placement = {start_ms: request.opportunity.a_roll_window.start_ms, end_ms: Math.min(request.opportunity.a_roll_window.start_ms + media.duration_ms, request.opportunity.a_roll_window.end_ms)};
  if (placement.start_ms >= placement.end_ms) throw new Error('opportunity window cannot contain a generated placement');
  const candidate_id = `cand_${digest({plugin_id: PLUGIN_ID, plugin_version: PLUGIN_VERSION, compiler_semantics: COMPILER_SEMANTICS, proposal_id: request.proposal_id, opportunity: request.opportunity}).slice(0, 24)}`;
  return {
    contract_version: CONTRACT_VERSION, request_id: request.request_id, opportunity_id: request.opportunity.opportunity_id,
    proposal_id: request.proposal_id, plugin_id: PLUGIN_ID, plugin_version: PLUGIN_VERSION, operation_status: 'COMPLETED',
    candidate: {
      candidate_id, asset_family: 'MG', candidate_status: 'READY', duration_ms: media.duration_ms, suggested_placement: placement,
      artifacts: [
        {role: 'PRIMARY_MEDIA', uri: 'local-runner://scene.mp4', media_type: 'video/mp4', sha256: media.sha256, duration_ms: media.duration_ms},
        {role: 'MANIFEST', uri: 'local-runner://manifest.json', media_type: 'application/json'},
        {role: 'QA_REPORT', uri: 'local-runner://qa.json', media_type: 'application/json'},
      ],
      qa: {status: 'PASSED', summary: '1920x1080, 30fps, SHA-256, and media duration checks passed'},
      provenance: {origin: 'plugin-generated', source_ref: 'local-runner://manifest.json'},
      plugin_metadata: {scene_version: 'mg-scene/1', compiler_semantics: COMPILER_SEMANTICS},
    },
  };
}

export function buildQaRejectedGenerationResult(request: GenerationRequest, media: {duration_ms: number; sha256: string}, summary: string): GenerationResult & {operation_status: 'COMPLETED'; candidate: NonNullable<GenerationResult['candidate']>} {
  const ready = buildReadyGenerationResult(request, media);
  return {...ready, candidate: {...ready.candidate, candidate_status: 'QA_REJECTED', qa: {status: 'FAILED', summary}}};
}
