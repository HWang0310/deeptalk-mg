import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import type {Grammar, MgScene} from './model';
import {EDITORIAL_CN_V1} from './profiles';

type GrammarComponent = React.FC<{scene: MgScene; frame: number}>;
const token = EDITORIAL_CN_V1;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const rise = (frame: number, start: number, end = start + 18) => interpolate(frame, [start, end], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
const full: React.CSSProperties = {width: '100%', height: '100%', background: token.colors.paper, color: token.colors.ink, fontFamily: token.typography.body, overflow: 'hidden'};

const Title: React.FC<{scene: MgScene; frame: number; anchor: 'top-left' | 'left-rail' | 'center-top' | 'bottom-left'}> = ({scene, frame, anchor}) => {
  const p = rise(frame, 0); const layout: Record<typeof anchor, React.CSSProperties> = {
    'top-left': {left: 136, top: 104, right: 136, maxWidth: 1420, fontSize: 68},
    'left-rail': {left: 136, top: 130, width: 620, fontSize: 58},
    'center-top': {left: 320, right: 320, top: 104, textAlign: 'center', fontSize: 58},
    'bottom-left': {left: 136, bottom: 118, width: 820, fontSize: 58},
  };
  return <div style={{position: 'absolute', opacity: p, translate: `0 ${(1 - p) * 24}px`, ...layout[anchor]}}>
    <div style={{width: anchor === 'left-rail' ? 8 : 72, height: anchor === 'left-rail' ? 118 : 8, background: token.colors.accent, marginBottom: 24}}/>
    <div style={{fontFamily: token.typography.display, fontWeight: 700, lineHeight: 1.18}}>{scene.primaryJudgment}</div>
  </div>;
};

const PlainSupports: React.FC<{scene: MgScene; frame: number; mode: 'row' | 'timeline'}> = ({scene, frame, mode}) => <div style={{position: 'absolute', left: 136, right: 136, bottom: 126, display: 'flex', gap: 24, alignItems: mode === 'timeline' ? 'flex-end' : 'stretch'}}>{scene.supporting.map((item, index) => {
  const p = rise(frame, 28 + index * 12);
  return <div key={item} style={{opacity: p, translate: mode === 'timeline' ? `${(1 - p) * -18}px 0` : `0 ${(1 - p) * 20}px`, flex: 1, minWidth: 0, borderTop: `4px solid ${index === 0 ? token.colors.accent : token.colors.muted}`, paddingTop: 16, fontSize: 30, lineHeight: 1.35}}>{mode === 'timeline' && <div style={{width: 14, height: 14, borderRadius: 9, background: token.colors.accent, marginBottom: 14}}/>}{item}</div>;
})}</div>;

const Thesis: GrammarComponent = ({scene, frame}) => <div style={full}><Title scene={scene} frame={frame} anchor="top-left"/><PlainSupports scene={scene} frame={frame} mode="row"/></div>;

const Causal: GrammarComponent = ({scene, frame}) => {
  const consequence = rise(frame, 68); const pulse = interpolate(frame, [32, 96], [0, 1], clamp);
  return <div style={full} data-grammar-marker="causal-pressure-propagation"><Title scene={scene} frame={frame} anchor="left-rail"/>
    <div style={{position: 'absolute', left: 820, right: 190, top: 220, height: 710}}>
      <div style={{position: 'absolute', left: 74, top: 38, bottom: 40, width: 5, background: token.colors.muted}}/>
      <div style={{position: 'absolute', left: 44, top: 38 + pulse * 590, width: 65, height: 65, borderRadius: 40, background: token.colors.accent, opacity: 0.88, scale: 0.7 + Math.min(pulse, 0.8) * 0.3}}/>
      <div style={{position: 'absolute', left: 135, top: 56, color: token.colors.accent, fontSize: 23, letterSpacing: 2}}>压力传导</div>
      {scene.supporting.map((item, index) => {const p = rise(frame, 28 + index * 15); const isLast = index === scene.supporting.length - 1; return <div key={item} style={{position: 'absolute', top: 95 + index * 150, left: 142, right: 0, opacity: p, translate: `${(1 - p) * -28}px 0`, display: 'flex', alignItems: 'center', gap: 22}}><div style={{width: 42, color: isLast ? token.colors.accent : token.colors.muted, fontSize: 24, fontWeight: 700}}>0{index + 1}</div><div style={{padding: '18px 24px', minWidth: 260, background: isLast ? '#F0D8CD' : token.colors.panel, borderLeft: `6px solid ${isLast ? token.colors.accent : token.colors.muted}`, fontSize: 38, fontWeight: isLast ? 700 : 500}}>{item}</div></div>;})}
      <div style={{position: 'absolute', right: 0, bottom: 10, opacity: consequence, fontSize: 28, color: token.colors.accent}}>累积后果</div>
    </div>
  </div>;
};

const Cycle: GrammarComponent = ({scene, frame}) => {
  const returnProgress = rise(frame, 72, 98); const positions = [[780, 320], [1220, 320], [1220, 660], [780, 660]];
  return <div style={full} data-grammar-marker="cycle-feedback-return"><Title scene={scene} frame={frame} anchor="center-top"/>
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}} aria-label="feedback loop"><path d="M 860 410 C 1080 250, 1410 390, 1370 650 C 1330 870, 900 900, 710 690 C 560 525, 680 360, 860 410" fill="none" stroke={token.colors.muted} strokeWidth="7" strokeDasharray="12 18" opacity={rise(frame, 24)}/><path d="M 770 710 C 640 600, 640 420, 820 390" fill="none" stroke={token.colors.accent} strokeWidth="11" strokeDasharray={`${returnProgress * 450} 520`} opacity={returnProgress}/></svg>
    {scene.supporting.map((item, index) => {const p = rise(frame, 28 + index * 15); const [left, top] = positions[index]; return <div key={item} style={{position: 'absolute', left, top, width: 220, height: 112, padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: index === 3 ? '#F0D8CD' : token.colors.panel, borderTop: `6px solid ${index === 3 ? token.colors.accent : token.colors.muted}`, opacity: p, scale: 0.9 + p * 0.1, fontSize: 32, fontWeight: index === 3 ? 700 : 500}}>{item}</div>;})}
    <div style={{position: 'absolute', left: 650, bottom: 112, opacity: returnProgress, color: token.colors.accent, fontSize: 30, fontWeight: 700}}>调整反馈回到执行，开始下一轮</div>
  </div>;
};

const Comparison: GrammarComponent = ({scene, frame}) => <div style={full}><Title scene={scene} frame={frame} anchor="top-left"/><div style={{position: 'absolute', left: 136, right: 136, bottom: 150, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 42}}>{scene.supporting.map((item, index) => {const p = rise(frame, 28 + index * 14); return <div key={item} style={{opacity: p, translate: `0 ${(1 - p) * 28}px`, padding: 36, borderTop: `8px solid ${index === 0 ? token.colors.accent : token.colors.muted}`, background: token.colors.panel, fontSize: 40, lineHeight: 1.28}}>{item}</div>;})}</div></div>;
const Delta: GrammarComponent = ({scene, frame}) => <div style={full}><Title scene={scene} frame={frame} anchor="bottom-left"/><div style={{position: 'absolute', left: 970, top: 330, right: 150, opacity: rise(frame, 30), display: 'flex', alignItems: 'baseline', gap: 32}}><div style={{fontSize: 142, fontWeight: 700, color: token.colors.accent}}>{scene.supporting[0]}</div><div style={{fontSize: 32, maxWidth: 440, lineHeight: 1.35}}>{scene.supporting[1]}</div></div></div>;

const Relationship: GrammarComponent = ({scene, frame}) => {
  const p = rise(frame, 32); const nodes = [{left: 220, top: 370}, {left: 1290, top: 300}, {left: 1270, top: 670}];
  return <div style={full} data-grammar-marker="relationship-influence-weight"><Title scene={scene} frame={frame} anchor="left-rail"/><svg width="1920" height="1080" style={{position: 'absolute', inset: 0}} aria-label="weighted relationships"><line x1="960" y1="570" x2="440" y2="440" stroke={token.colors.muted} strokeWidth="7" opacity={p}/><line x1="960" y1="570" x2="1400" y2="370" stroke={token.colors.accent} strokeWidth="16" opacity={p}/><line x1="960" y1="570" x2="1400" y2="740" stroke={token.colors.muted} strokeWidth="4" opacity={p}/></svg>
    <div style={{position: 'absolute', left: 790, top: 470, width: 340, minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center', background: '#F0D8CD', border: `8px solid ${token.colors.accent}`, opacity: p, fontSize: 40, fontWeight: 700}}>协同中心</div>
    {scene.supporting.map((item, index) => {const q = rise(frame, 42 + index * 14); return <div key={item} style={{position: 'absolute', left: nodes[index].left, top: nodes[index].top, width: index === 1 ? 300 : 250, minHeight: index === 1 ? 140 : 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center', background: token.colors.panel, borderTop: `${index === 1 ? 8 : 4}px solid ${index === 1 ? token.colors.accent : token.colors.muted}`, opacity: q, scale: index === 1 ? 1 : 0.9 + q * 0.1, fontSize: index === 1 ? 34 : 29}}>{item}</div>;})}
    <div style={{position: 'absolute', right: 130, bottom: 110, color: token.colors.accent, fontSize: 25, opacity: p}}>线条粗细 = 影响强度</div>
  </div>;
};

const Timeline: GrammarComponent = ({scene, frame}) => <div style={full}><Title scene={scene} frame={frame} anchor="top-left"/><PlainSupports scene={scene} frame={frame} mode="timeline"/></div>;
const Metaphor: GrammarComponent = ({scene, frame}) => <div style={full} data-grammar-marker="abstract-surface-threshold"><Title scene={scene} frame={frame} anchor="bottom-left"/><div style={{position: 'absolute', left: 1000, right: 150, top: 180, height: 610}}><div style={{position: 'absolute', left: 0, right: 0, top: 150, borderTop: `7px solid ${token.colors.accent}`, opacity: rise(frame, 25)}}/><div style={{position: 'absolute', top: 95, left: 0, color: token.colors.accent, fontSize: 27, letterSpacing: 2, opacity: rise(frame, 25)}}>表层：看得见的结果</div><div style={{position: 'absolute', top: 185, left: 0, color: token.colors.muted, fontSize: 27, letterSpacing: 2, opacity: rise(frame, 45)}}>底层：持续积累的机制</div>{scene.supporting.map((item, index) => {const p = rise(frame, 42 + index * 15); return <div key={item} style={{position: 'absolute', left: index * 58, right: 0, top: 250 + index * 100, padding: '18px 24px', background: index === 2 ? '#E3C5B8' : token.colors.panel, borderLeft: `7px solid ${index === 2 ? token.colors.accent : token.colors.muted}`, opacity: p, translate: `${(1 - p) * -28}px 0`, fontSize: 34, fontWeight: index === 2 ? 700 : 500}}>{item}</div>;})}</div></div>;

const GRAMMAR_COMPONENTS: Record<Grammar, GrammarComponent> = {thesis: Thesis, 'causal-flow': Causal, cycle: Cycle, 'paired-contrast': Comparison, 'delta-metric': Delta, 'relationship-map': Relationship, 'editorial-timeline': Timeline, 'layered-metaphor': Metaphor};
export const grammarFor = (grammar: Grammar): GrammarComponent => GRAMMAR_COMPONENTS[grammar];
const VARIANT_CUES: Partial<Record<NonNullable<MgScene['semanticVariant']>, string>> = {
  'branching-consequence': '一因 · 双向后果', 'delayed-effect': '延迟显形', 'pressure-transfer': '压力转移', 'cumulative-consequence': '逐层累积',
  'positive-feedback': '放大回路', 'negative-feedback': '回拉回路', 'accelerating-loop': '加速回路', 'weakening-loop': '衰减回路',
  dependency: '关键依赖', tension: '目标拉扯', hierarchy: '权力层级', collaboration: '协同汇聚',
  bottleneck: '最窄环节', constraint: '隐性约束', threshold: '临界阈值', accumulation: '持续叠加', 'hidden-mechanism': '底层机制', compounding: '逐轮抬升',
};
export const BenchmarkScene: React.FC<{scene: MgScene; frame?: number}> = ({scene, frame = 0}) => {const Component = grammarFor(scene.grammar); const cue = scene.semanticVariant && VARIANT_CUES[scene.semanticVariant]; return <div data-semantic-variant={scene.semanticVariant}><Component scene={scene} frame={frame}/>{cue && <div style={{position: 'absolute', right: 136, bottom: 76, color: token.colors.accent, fontFamily: token.typography.body, fontSize: 24, letterSpacing: 2, opacity: rise(frame, 54)}}>{cue}</div>}</div>;};
export const BenchmarkComposition: React.FC<{scene: MgScene}> = ({scene}) => <BenchmarkScene scene={scene} frame={useCurrentFrame()}/>;
