import type {MgScene, SemanticVariant} from '../src/model';

const scene = (id: string, grammar: MgScene['grammar'], semanticVariant: SemanticVariant, primaryJudgment: string, supporting: string[]): MgScene => ({sceneVersion: 'mg-scene/1', id, benchmarkKind: grammar === 'causal-flow' ? 'causal-chain' : grammar === 'cycle' ? 'process-cycle' : grammar === 'relationship-map' ? 'multi-node' : 'abstract-explanation', profile: 'editorial-cn-v1', grammar, durationSeconds: 7, primaryJudgment, supporting, semanticVariant});

export const SEMANTIC_VARIANT_SCENES: MgScene[] = [
  scene('causal-branching', 'causal-flow', 'branching-consequence', '一项成本上升，会分叉成两类后果。', ['原料涨价', '利润收窄', '服务缩减', '价格上调']),
  scene('causal-delayed', 'causal-flow', 'delayed-effect', '今天的投入不足，常在未来才显形。', ['研发缩减', '短期无感', '产品落后', '份额下滑']),
  scene('causal-pressure', 'causal-flow', 'pressure-transfer', '压力不会消失，只会转移到更弱的一环。', ['需求下滑', '渠道承压', '供应压价', '交付受损']),
  scene('causal-cumulative', 'causal-flow', 'cumulative-consequence', '小幅妥协反复累积，最终改变结果。', ['一次让步', '边际变薄', '能力削弱', '竞争失速']),
  scene('cycle-positive', 'cycle', 'positive-feedback', '正反馈会把优势继续放大。', ['体验提升', '用户增长', '数据变多', '体验再提升']),
  scene('cycle-negative', 'cycle', 'negative-feedback', '负反馈的价值，是把偏差拉回边界。', ['需求过热', '价格上升', '需求回落', '供需平衡']),
  scene('cycle-accelerating', 'cycle', 'accelerating-loop', '循环越快，变化越快。', ['试错加快', '学习加快', '决策加快', '下一轮更快']),
  scene('cycle-weakening', 'cycle', 'weakening-loop', '反馈变弱时，系统会逐步失去修正能力。', ['信号减少', '判断变慢', '行动变弱', '信号更少']),
  scene('relationship-dependency', 'relationship-map', 'dependency', '关键依赖决定了系统的脆弱点。', ['核心供应', '主系统', '交付团队']),
  scene('relationship-tension', 'relationship-map', 'tension', '两方目标相互拉扯，不能只看单点最优。', ['增长目标', '资源中心', '成本约束']),
  scene('relationship-hierarchy', 'relationship-map', 'hierarchy', '决策权的层级，决定信息如何流动。', ['执行层', '决策中心', '业务单元']),
  scene('relationship-collaboration', 'relationship-map', 'collaboration', '协作的关键，是让不同专长汇聚到同一判断。', ['产品', '协作中心', '运营']),
  scene('abstract-bottleneck', 'layered-metaphor', 'bottleneck', '整体速度，取决于最窄的环节。', ['需求汇入', '瓶颈通道', '产出受限']),
  scene('abstract-constraint', 'layered-metaphor', 'constraint', '真正的约束，往往藏在可用资源之外。', ['表面资源', '隐性规则', '行动边界']),
  scene('abstract-threshold', 'layered-metaphor', 'threshold', '跨过阈值后，结果会出现非线性变化。', ['积累输入', '临界阈值', '结果跃迁']),
  scene('abstract-accumulation', 'layered-metaphor', 'accumulation', '看似静止的结果，来自持续积累。', ['微小变化', '持续叠加', '结构改变']),
  scene('abstract-hidden', 'layered-metaphor', 'hidden-mechanism', '看得见的是结果，看不见的是驱动它的机制。', ['可见表现', '隐含机制', '真实驱动']),
  scene('abstract-compounding', 'layered-metaphor', 'compounding', '复利不是一次跃升，而是每轮把基础抬高。', ['初始能力', '每轮增益', '能力复利']),
];
