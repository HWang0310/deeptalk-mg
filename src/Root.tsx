import React from 'react';
import {Composition, Still} from 'remotion';
import {BENCHMARK_SCENES} from '../benchmarks/scenes';
import {SEMANTIC_VARIANT_SCENES} from '../benchmarks/semantic-variants';
import {COMMON_BRIEF_TRIAL_SCENES} from '../benchmarks/common-brief-trial';
import {BenchmarkComposition, BenchmarkScene} from './grammars';
import {CANVAS} from './model';

export const RemotionRoot: React.FC = () => <>
  {BENCHMARK_SCENES.map((scene) => <Composition key={scene.id} id={`Benchmark-${scene.id}`} component={BenchmarkComposition} defaultProps={{scene}}
    durationInFrames={scene.durationSeconds * CANVAS.fps} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height}/>) }
  {BENCHMARK_SCENES.map((scene) => <Still key={`still-${scene.id}`} id={`Still-${scene.id}`} component={BenchmarkScene} defaultProps={{scene, frame: 0}}
    width={CANVAS.width} height={CANVAS.height}/>) }
  {SEMANTIC_VARIANT_SCENES.map((scene) => <Composition key={`variant-${scene.id}`} id={`Variant-${scene.id}`} component={BenchmarkComposition} defaultProps={{scene}}
    durationInFrames={scene.durationSeconds * CANVAS.fps} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height}/>) }
  {COMMON_BRIEF_TRIAL_SCENES.map((scene) => <Composition key={`trial-${scene.id}`} id={`Trial-${scene.id}`} component={BenchmarkComposition} defaultProps={{scene}}
    durationInFrames={scene.durationSeconds * CANVAS.fps} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height}/>) }
</>;
