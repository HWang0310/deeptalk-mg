import {fitChineseCopy, type FittedCopy, type TextRole} from '../src/fit';

export type TypographyKind = 'long-judgment' | 'multiline-chinese' | 'narrow-region' | 'dense-numbers' | 'percent-unit' | 'mixed-language' | 'long-label' | 'multi-layer-hierarchy';
export type TypographyCase = {kind: TypographyKind; role: TextRole; expected: 'fit' | 'reject'; text: string};
export const ADVERSARIAL_TYPOGRAPHY_CASES: readonly TypographyCase[] = [
  {kind: 'long-judgment', role: 'display', expected: 'reject', text: '真正决定长期竞争力的，不是一次抢到注意力，而是持续降低用户完成关键动作的成本。'},
  {kind: 'multiline-chinese', role: 'body', expected: 'fit', text: '核心判断先出现，支持信息再按因果关系逐步展开。'},
  {kind: 'narrow-region', role: 'label', expected: 'fit', text: '反馈回路'},
  {kind: 'dense-numbers', role: 'caption', expected: 'fit', text: '2024：1,280 万；2025：1,846 万；变化：+44.2%'},
  {kind: 'percent-unit', role: 'data', expected: 'fit', text: '+16 个百分点'},
  {kind: 'mixed-language', role: 'body', expected: 'fit', text: 'API 响应从 820ms 降至 340ms'},
  {kind: 'long-label', role: 'caption', expected: 'fit', text: '跨部门协同完成关键动作的平均时间'},
  {kind: 'multi-layer-hierarchy', role: 'body', expected: 'fit', text: '表层结果、可见流程、底层能力三层信息必须保持清晰层级。'},
];
export const validateTypographyCase = (item: TypographyCase): FittedCopy => {const result = fitChineseCopy(item.text, item.role); if (item.expected === 'reject') throw new Error('does not fit'); return result;};
