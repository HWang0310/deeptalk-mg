import {describe, expect, it} from 'vitest';
import {BENCHMARK_SCENES} from '../benchmarks/scenes';
import {validateScene} from '../src/model';

describe('stable benchmark suite', () => {
  it('covers each approved cognitive task exactly once', () => {
    expect(BENCHMARK_SCENES.map((scene) => scene.benchmarkKind).sort()).toEqual([
      'abstract-explanation', 'causal-chain', 'comparison', 'core-judgment',
      'multi-node', 'numeric-change', 'process-cycle', 'timeline',
    ]);
  });

  it('contains unique valid editorial scenes', () => {
    expect(new Set(BENCHMARK_SCENES.map((scene) => scene.id)).size).toBe(8);
    for (const scene of BENCHMARK_SCENES) expect(validateScene(scene)).toBe(scene);
  });
});
