import {describe, expect, it} from 'vitest';
import {ADVERSARIAL_TYPOGRAPHY_CASES, validateTypographyCase} from '../benchmarks/typography-cases';

describe('adversarial Chinese typography benchmark', () => {
  it('covers all approved adversarial categories', () => {
    expect(ADVERSARIAL_TYPOGRAPHY_CASES.map((item) => item.kind).sort()).toEqual([
      'dense-numbers', 'long-judgment', 'long-label', 'mixed-language',
      'multi-layer-hierarchy', 'multiline-chinese', 'narrow-region', 'percent-unit',
    ]);
  });

  it('preserves every source character for fitting cases', () => {
    for (const item of ADVERSARIAL_TYPOGRAPHY_CASES.filter((item) => item.expected === 'fit')) {
      expect(validateTypographyCase(item).lines.join('')).toBe(item.text);
    }
  });

  it('rejects every pressure case declared unreadable', () => {
    for (const item of ADVERSARIAL_TYPOGRAPHY_CASES.filter((item) => item.expected === 'reject')) {
      expect(() => validateTypographyCase(item)).toThrow('does not fit');
    }
  });

  it('fails closed for a label that would become unreadable', () => {
    expect(() => validateTypographyCase({kind: 'long-label', role: 'label', expected: 'reject', text: '极长标签'.repeat(20)})).toThrow('does not fit');
  });
});
