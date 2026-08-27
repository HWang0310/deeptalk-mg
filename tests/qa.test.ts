import {describe, expect, it} from 'vitest';
import {validateQaRecord} from '../src/qa';

describe('benchmark machine QA', () => {
  it('accepts complete standard output metadata', () => {
    expect(validateQaRecord({width: 1920, height: 1080, fps: 30, durationSeconds: 8, expectedDurationSeconds: 8, stillCount: 3, sha256: 'a'.repeat(64)})).toBe(true);
  });

  it('rejects a nonstandard frame rate', () => {
    expect(() => validateQaRecord({width: 1920, height: 1080, fps: 24, durationSeconds: 8, expectedDurationSeconds: 8, stillCount: 3, sha256: 'a'.repeat(64)})).toThrow('fps');
  });

  it('rejects a render missing a phase still', () => {
    expect(() => validateQaRecord({width: 1920, height: 1080, fps: 30, durationSeconds: 8, expectedDurationSeconds: 8, stillCount: 2, sha256: 'a'.repeat(64)})).toThrow('stillCount');
  });
});
