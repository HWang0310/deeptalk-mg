import {describe, expect, it} from 'vitest';
import {CANVAS, validateScene} from '../src/model';

const validScene = {
  sceneVersion: 'mg-scene/1' as const,
  id: 'core-judgment',
  benchmarkKind: 'core-judgment' as const,
  profile: 'editorial-cn-v1' as const,
  grammar: 'thesis' as const,
  durationSeconds: 8,
  primaryJudgment: '真正重要的不是速度，而是决策质量。',
  supporting: ['先确定判断，再逐步展开依据。'],
};

describe('mg-scene validation', () => {
  it('publishes a fixed 16:9 benchmark canvas', () => {
    expect(CANVAS).toEqual({width: 1920, height: 1080, fps: 30});
  });

  it('accepts a complete independent scene definition', () => {
    expect(validateScene(validScene)).toMatchObject(validScene);
  });

  it('rejects an empty primary judgment before rendering', () => {
    expect(() => validateScene({...validScene, primaryJudgment: ''})).toThrow('primaryJudgment');
  });

  it('rejects an unsupported grammar before rendering', () => {
    expect(() => validateScene({...validScene, grammar: 'unknown' as never})).toThrow('grammar');
  });
});
