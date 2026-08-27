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
});
