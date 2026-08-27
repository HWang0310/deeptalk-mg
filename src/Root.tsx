import React from 'react';
import {Composition, Still} from 'remotion';
import {BENCHMARK_SCENES} from '../benchmarks/scenes';
import {BenchmarkComposition, BenchmarkScene} from './grammars';
import {CANVAS} from './model';

export const RemotionRoot: React.FC = () => <>
  {BENCHMARK_SCENES.map((scene) => <Composition key={scene.id} id={`Benchmark-${scene.id}`} component={BenchmarkComposition} defaultProps={{scene}}
    durationInFrames={scene.durationSeconds * CANVAS.fps} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height}/>) }
  {BENCHMARK_SCENES.map((scene) => <Still key={`still-${scene.id}`} id={`Still-${scene.id}`} component={BenchmarkScene} defaultProps={{scene, frame: 0}}
    width={CANVAS.width} height={CANVAS.height}/>) }
</>;
