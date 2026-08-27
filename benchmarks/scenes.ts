import type {MgScene} from '../src/model';

const scene = (id: MgScene['id'], benchmarkKind: MgScene['benchmarkKind'], grammar: MgScene['grammar'], primaryJudgment: string, supporting: string[], durationSeconds = 8): MgScene => ({
  sceneVersion: 'mg-scene/1', id, benchmarkKind, profile: 'editorial-cn-v1', grammar, durationSeconds, primaryJudgment, supporting,
});

export const BENCHMARK_SCENES: readonly MgScene[] = [
  scene('core-judgment', 'core-judgment', 'thesis', '真正重要的不是速度，而是决策质量。', ['先给出判断，再展示决定质量的两个条件。']),
  scene('causal-chain', 'causal-chain', 'causal-flow', '低价竞争会把压力传导到服务质量。', ['价格下降', '利润收窄', '投入减少', '体验下降']),
  scene('process-cycle', 'process-cycle', 'cycle', '复盘让下一轮决策更准确。', ['执行', '观察', '复盘', '调整']),
  scene('comparison', 'comparison', 'paired-contrast', '同样的投入，重点不同，结果就不同。', ['短期：抢占注意力', '长期：积累信任']),
  scene('numeric-change', 'numeric-change', 'delta-metric', '用户留存从 42% 提升到 58%。', ['+16 个百分点', '关键动作：缩短首次完成路径']),
  scene('multi-node', 'multi-node', 'relationship-map', '协同来自清晰分工，而非更多会议。', ['产品定义方向', '研发构建能力', '运营验证反馈']),
  scene('timeline', 'timeline', 'editorial-timeline', '转折发生在规则改变之后。', ['第一阶段：旧规则', '第二阶段：规则变化', '第三阶段：结果显现']),
  scene('abstract-explanation', 'abstract-explanation', 'layered-metaphor', '护城河不是墙，而是持续积累的系统。', ['能力积累', '协同增强', '对手更难复制']),
];
