export const CANVAS = {width: 1920, height: 1080, fps: 30} as const;

export const BENCHMARK_KINDS = [
  'core-judgment', 'causal-chain', 'process-cycle', 'comparison',
  'numeric-change', 'multi-node', 'timeline', 'abstract-explanation',
] as const;
export const GRAMMARS = [
  'thesis', 'causal-flow', 'cycle', 'paired-contrast', 'delta-metric',
  'relationship-map', 'editorial-timeline', 'layered-metaphor',
] as const;

export type BenchmarkKind = (typeof BENCHMARK_KINDS)[number];
export type Grammar = (typeof GRAMMARS)[number];
export type Profile = 'editorial-cn-v1';
export type SemanticVariant =
  | 'branching-consequence' | 'delayed-effect' | 'pressure-transfer' | 'cumulative-consequence'
  | 'positive-feedback' | 'negative-feedback' | 'accelerating-loop' | 'weakening-loop'
  | 'dependency' | 'tension' | 'hierarchy' | 'collaboration'
  | 'bottleneck' | 'constraint' | 'threshold' | 'accumulation' | 'hidden-mechanism' | 'compounding';

export type MgScene = {
  sceneVersion: 'mg-scene/1';
  id: string;
  benchmarkKind: BenchmarkKind;
  profile: Profile;
  grammar: Grammar;
  durationSeconds: number;
  primaryJudgment: string;
  supporting: string[];
  semanticVariant?: SemanticVariant;
};

const has = <T extends readonly string[]>(values: T, value: string): boolean => values.includes(value);
const VARIANT_GRAMMARS: Record<SemanticVariant, Grammar> = {
  'branching-consequence':'causal-flow','delayed-effect':'causal-flow','pressure-transfer':'causal-flow','cumulative-consequence':'causal-flow',
  'positive-feedback':'cycle','negative-feedback':'cycle','accelerating-loop':'cycle','weakening-loop':'cycle',
  dependency:'relationship-map',tension:'relationship-map',hierarchy:'relationship-map',collaboration:'relationship-map',
  bottleneck:'layered-metaphor',constraint:'layered-metaphor',threshold:'layered-metaphor',accumulation:'layered-metaphor','hidden-mechanism':'layered-metaphor',compounding:'layered-metaphor',
};

export function validateScene(input: MgScene): MgScene {
  if (input.sceneVersion !== 'mg-scene/1') throw new Error('sceneVersion must be mg-scene/1');
  if (!input.id.trim()) throw new Error('id is required');
  if (!has(BENCHMARK_KINDS, input.benchmarkKind)) throw new Error('benchmarkKind is not supported');
  if (input.profile !== 'editorial-cn-v1') throw new Error('profile is not supported');
  if (!has(GRAMMARS, input.grammar)) throw new Error('grammar is not supported');
  if (input.semanticVariant && VARIANT_GRAMMARS[input.semanticVariant] !== input.grammar) throw new Error('semanticVariant is not supported by this grammar');
  if (!input.primaryJudgment.trim()) throw new Error('primaryJudgment is required');
  if (!Number.isFinite(input.durationSeconds) || input.durationSeconds < 4 || input.durationSeconds > 16) {
    throw new Error('durationSeconds must be between 4 and 16');
  }
  if (input.supporting.length > 5 || input.supporting.some((item) => !item.trim())) {
    throw new Error('supporting must contain one to five non-empty statements');
  }
  return input;
}
