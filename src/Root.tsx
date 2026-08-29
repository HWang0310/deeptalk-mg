import React from 'react';
import {Composition, Still} from 'remotion';
import {BENCHMARK_SCENES} from '../benchmarks/scenes';
import {SEMANTIC_VARIANT_SCENES} from '../benchmarks/semantic-variants';
import {COMMON_BRIEF_TRIAL_SCENES} from '../benchmarks/common-brief-trial';
import {BenchmarkComposition, BenchmarkScene} from './grammars';
import {CANVAS, type MgScene} from './model';

const CONTRACT_DYNAMIC_DEFAULT: MgScene = {
  sceneVersion: 'mg-scene/1', id: 'contract-dynamic-default', benchmarkKind: 'causal-chain',
  profile: 'editorial-cn-v1', grammar: 'causal-flow', durationSeconds: 7,
  primaryJudgment: '机制变化会沿链条传导。', supporting: ['触发因素', '传导过程', '累积后果'],
};

export const RemotionRoot: React.FC = () => <>
  <Composition id="ContractDynamic" component={BenchmarkComposition} defaultProps={{scene: CONTRACT_DYNAMIC_DEFAULT}}
    durationInFrames={CONTRACT_DYNAMIC_DEFAULT.durationSeconds * CANVAS.fps} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height}/>
  {BENCHMARK_SCENES.map((scene) => <Composition key={scene.id} id={`Benchmark-${scene.id}`} component={BenchmarkComposition} defaultProps={{scene}}
    durationInFrames={scene.durationSeconds * CANVAS.fps} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height}/>) }
  {BENCHMARK_SCENES.map((scene) => <Still key={`still-${scene.id}`} id={`Still-${scene.id}`} component={BenchmarkScene} defaultProps={{scene, frame: 0}}
    width={CANVAS.width} height={CANVAS.height}/>) }
  {SEMANTIC_VARIANT_SCENES.map((scene) => <Composition key={`variant-${scene.id}`} id={`Variant-${scene.id}`} component={BenchmarkComposition} defaultProps={{scene}}
    durationInFrames={scene.durationSeconds * CANVAS.fps} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height}/>) }
  {COMMON_BRIEF_TRIAL_SCENES.map((scene) => <Composition key={`trial-${scene.id}`} id={`Trial-${scene.id}`} component={BenchmarkComposition} defaultProps={{scene}}
    durationInFrames={scene.durationSeconds * CANVAS.fps} fps={CANVAS.fps} width={CANVAS.width} height={CANVAS.height}/>) }
</>;
