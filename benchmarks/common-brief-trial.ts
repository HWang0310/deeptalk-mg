import type {MgScene} from '../src/model';

const s=(id:string,benchmarkKind:MgScene['benchmarkKind'],grammar:MgScene['grammar'],primaryJudgment:string,supporting:string[],semanticVariant?:MgScene['semanticVariant']):MgScene=>({sceneVersion:'mg-scene/1',id,benchmarkKind,profile:'editorial-cn-v1',grammar,durationSeconds:8,primaryJudgment,supporting,semanticVariant});

export const COMMON_BRIEF_TRIAL_SCENES: readonly MgScene[]=[
  s('cb01-core-judgment','core-judgment','thesis','真正的问题不是增长快，而是增长能否自我维持。',['判断重点：是否依赖下一轮增长维持当前增长']),
  s('cb02-causal-transmission','causal-chain','causal-flow','成本上升，压力最终传导到用户体验。',['成本上升','利润收窄','投入下降','体验受损'],'pressure-transfer'),
  s('cb03-accumulation-pressure','abstract-explanation','layered-metaphor','分散压力会在阈值处集中出现。',['每轮扩张','承诺增加','资源占用','压力集中'],'accumulation'),
  s('cb04-feedback-loop','process-cycle','cycle','体验改善会形成正反馈循环。',['体验改善','用户增长','数据增加','产品再改善'],'positive-feedback'),
  s('cb05-two-side-tension','multi-node','relationship-map','增长与风险控制形成持续拉扯。',['增长团队','资源分配','财务团队'],'tension'),
  s('cb06-surface-mechanism','abstract-explanation','layered-metaphor','表面稳定，不等于底层风险已经消失。',['可见稳定','压力转移','底层风险'],'hidden-mechanism'),
  s('cb07-rule-change','timeline','editorial-timeline','规则改变后，原有路径可能产生完全不同的结果。',['改变前：旧路径有效','规则改变','改变后：结果反转']),
  s('cb08-numeric-evidence','numeric-change','delta-metric','留存提升的关键，是首次完成路径变短。',['42% → 58%','机制：首次完成路径明显缩短']),
];
