import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import {BENCHMARK_SCENES} from '../benchmarks/scenes';
import {BenchmarkScene, grammarFor} from '../src/grammars';

describe('editorial scene grammars', () => {
  it('maps every approved grammar to a renderer', () => {
    for (const scene of BENCHMARK_SCENES) expect(grammarFor(scene.grammar)).toBeDefined();
  });

  it('renders the primary judgment as semantic text', () => {
    const html = renderToStaticMarkup(<BenchmarkScene scene={BENCHMARK_SCENES[0]} />);
    expect(html).toContain('真正重要的不是速度，而是决策质量。');
  });

  it('renders meaning-bound markers for the four differentiated grammars', () => {
    const rendered = Object.fromEntries(BENCHMARK_SCENES.map((scene) => [
      scene.benchmarkKind,
      renderToStaticMarkup(<BenchmarkScene scene={scene} frame={120} />),
    ]));
    expect(rendered['causal-chain']).toContain('causal-pressure-propagation');
    expect(rendered['process-cycle']).toContain('cycle-feedback-return');
    expect(rendered['multi-node']).toContain('relationship-influence-weight');
    expect(rendered['abstract-explanation']).toContain('abstract-surface-threshold');
  });
});
