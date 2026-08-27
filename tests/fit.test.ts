import {describe, expect, it} from 'vitest';
import {fitChineseCopy} from '../src/fit';

describe('Chinese editorial copy fitting', () => {
  it('keeps a short editorial judgment on one display line', () => {
    expect(fitChineseCopy('先判断，再展开。', 'display').lines).toEqual(['先判断，再展开。']);
  });

  it('wraps Chinese body copy without dropping characters', () => {
    const result = fitChineseCopy('核心判断先出现，支持信息随后逐步展开。', 'body');
    expect(result.lines.join('')).toBe('核心判断先出现，支持信息随后逐步展开。');
    expect(result.lines.length).toBe(1);
  });

  it('rejects copy that cannot fit its assigned role', () => {
    expect(() => fitChineseCopy('很长'.repeat(40), 'caption')).toThrow('does not fit');
  });
});
