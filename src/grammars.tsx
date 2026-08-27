import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {Grammar, MgScene} from './model';
import {EDITORIAL_CN_V1} from './profiles';

type GrammarComponent = React.FC<{scene: MgScene; frame: number}>;
const token = EDITORIAL_CN_V1;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const Shell: React.FC<{scene: MgScene; frame: number; children: React.ReactNode}> = ({scene, frame, children}) => {
  const primary = interpolate(frame, [0, token.motion.primaryFrames], [0, 1], clamp);
  return <div style={{width: '100%', height: '100%', background: token.colors.paper, color: token.colors.ink, fontFamily: token.typography.body, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: token.spacing.safeX, right: token.spacing.safeX, top: token.spacing.safeY, opacity: primary, transform: `translateY(${(1 - primary) * 22}px)`}}>
      <div style={{width: 72, height: 8, background: token.colors.accent, marginBottom: 28}} />
      <div style={{fontFamily: token.typography.display, fontSize: 68, fontWeight: 700, lineHeight: 1.18, maxWidth: 1420}}>{scene.primaryJudgment}</div>
    </div>
    {children}
  </div>;
};

const Supports: React.FC<{scene: MgScene; frame: number; mode: 'row' | 'chain' | 'orbit' | 'timeline'}> = ({scene, frame, mode}) => {
  const items = scene.supporting;
  const visible = (index: number) => interpolate(frame, [28 + index * 12, 44 + index * 12], [0, 1], clamp);
  const base: React.CSSProperties = {position: 'absolute', left: token.spacing.safeX, right: token.spacing.safeX, bottom: 126, display: 'flex', gap: 24};
  if (mode === 'timeline') return <div style={{...base, alignItems: 'flex-end'}}>{items.map((item, index) => {
    const opacity = visible(index);
    return <div key={item} style={{opacity, transform: `translateX(${(1 - opacity) * -18}px)`, minWidth: 220}}><div style={{height: 2, background: token.colors.muted, marginBottom: 16}}/><div style={{width: 14, height: 14, borderRadius: 10, background: token.colors.accent, marginBottom: 14}}/><div style={{fontSize: 30, lineHeight: 1.35}}>{item}</div></div>;
  })}</div>;
  return <div style={{...base, flexDirection: mode === 'chain' ? 'column' : 'row', justifyContent: mode === 'orbit' ? 'center' : 'flex-start', alignItems: mode === 'chain' ? 'flex-start' : 'stretch'}}>{items.map((item, index) => {
    const opacity = visible(index);
    return <div key={item} style={{opacity, transform: mode === 'chain' ? `translateX(${(1 - opacity) * -28}px)` : `translateY(${(1 - opacity) * 24}px)`, flex: mode === 'chain' ? undefined : 1, minWidth: 0, borderTop: `4px solid ${index === 0 ? token.colors.accent : token.colors.muted}`, paddingTop: 16, fontSize: mode === 'chain' ? 34 : 30, lineHeight: 1.35}}>{mode === 'chain' && <span style={{color: token.colors.accent, paddingRight: 18}}>→</span>}{item}</div>;
  })}</div>;
};

const Thesis: GrammarComponent = ({scene, frame}) => <Shell scene={scene} frame={frame}><Supports scene={scene} frame={frame} mode="row"/></Shell>;
const Causal: GrammarComponent = ({scene, frame}) => <Shell scene={scene} frame={frame}><Supports scene={scene} frame={frame} mode="chain"/></Shell>;
const Cycle: GrammarComponent = ({scene, frame}) => <Shell scene={scene} frame={frame}><div style={{position: 'absolute', left: 620, top: 470, width: 680, height: 360, border: `4px solid ${token.colors.muted}`, borderRadius: '50%', opacity: interpolate(frame, [28, 48], [0, 1], clamp)}}/><Supports scene={scene} frame={frame} mode="orbit"/></Shell>;
const Comparison: GrammarComponent = ({scene, frame}) => <Shell scene={scene} frame={frame}><div style={{position: 'absolute', left: 136, right: 136, bottom: 150, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 42}}>{scene.supporting.map((item, index) => {const p = interpolate(frame, [28 + index * 14, 46 + index * 14], [0, 1], clamp); return <div key={item} style={{opacity: p, transform: `translateY(${(1 - p) * 28}px)`, padding: 36, borderTop: `8px solid ${index === 0 ? token.colors.accent : token.colors.muted}`, background: token.colors.panel, fontSize: 40, lineHeight: 1.28}}>{item}</div>;})}</div></Shell>;
const Delta: GrammarComponent = ({scene, frame}) => <Shell scene={scene} frame={frame}><div style={{position: 'absolute', left: 136, bottom: 150, display: 'flex', alignItems: 'baseline', gap: 42, opacity: interpolate(frame, [28, 48], [0, 1], clamp)}}><div style={{fontSize: 142, fontWeight: 700, color: token.colors.accent}}>{scene.supporting[0]}</div><div style={{fontSize: 38, maxWidth: 620, lineHeight: 1.35}}>{scene.supporting[1]}</div></div></Shell>;
const Relationship: GrammarComponent = ({scene, frame}) => <Shell scene={scene} frame={frame}><div style={{position: 'absolute', left: 220, right: 220, bottom: 140, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>{scene.supporting.map((item, index) => {const p = interpolate(frame, [28 + index * 12, 48 + index * 12], [0, 1], clamp); return <React.Fragment key={item}><div style={{width: 320, minHeight: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20, background: token.colors.panel, borderTop: `6px solid ${index === 1 ? token.colors.accent : token.colors.muted}`, opacity: p}}>{item}</div>{index < scene.supporting.length - 1 && <div style={{height: 3, flex: 1, background: token.colors.muted, opacity: p}}/>}</React.Fragment>;})}</div></Shell>;
const Timeline: GrammarComponent = ({scene, frame}) => <Shell scene={scene} frame={frame}><Supports scene={scene} frame={frame} mode="timeline"/></Shell>;
const Metaphor: GrammarComponent = ({scene, frame}) => <Shell scene={scene} frame={frame}><div style={{position: 'absolute', right: 190, bottom: 164, width: 430, height: 430, border: `42px solid ${token.colors.panel}`, borderTopColor: token.colors.accent, borderRadius: '50%', opacity: interpolate(frame, [28, 52], [0, 1], clamp)}}/><Supports scene={scene} frame={frame} mode="chain"/></Shell>;

const GRAMMAR_COMPONENTS: Record<Grammar, GrammarComponent> = {
  thesis: Thesis, 'causal-flow': Causal, cycle: Cycle, 'paired-contrast': Comparison,
  'delta-metric': Delta, 'relationship-map': Relationship, 'editorial-timeline': Timeline, 'layered-metaphor': Metaphor,
};

export const grammarFor = (grammar: Grammar): GrammarComponent => GRAMMAR_COMPONENTS[grammar];
export const BenchmarkScene: React.FC<{scene: MgScene; frame?: number}> = ({scene, frame = 0}) => {
  const Component = grammarFor(scene.grammar);
  return <Component scene={scene} frame={frame}/>;
};
export const BenchmarkComposition: React.FC<{scene: MgScene}> = ({scene}) => <BenchmarkScene scene={scene} frame={useCurrentFrame()}/>;
