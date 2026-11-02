import React, { useMemo } from 'react';
import { ScoreData } from '../types';
import { ArrowLeft } from 'lucide-react';

interface Props {
  data: ScoreData;
  onChange: (d: ScoreData) => void;
  onBack: () => void;
  onNext: () => void;
  isRestricted: boolean;
}

export default function ScoringForm({ data, onChange, onBack, onNext, isRestricted }: Props) {

  const toggle = (key: keyof ScoreData) => {
    onChange({ ...data, [key]: !data[key] });
  };

  const calculateScore = () => {
    let score = 0;
    // 1. Alignment (0-20)
    if (data.btcAligned) score += 10;
    if (data.ethConfirming) score += 5;
    if (data.altStrength) score += 5;

    // 2. Structure (0-25)
    if (data.atLiqCluster) score += 10;
    if (data.atSRConfluence) score += 10;
    if (data.wickFalseBreak) score += 5;

    // 3. Derivatives (0-20)
    if (data.oiDivergence) score += 8;
    if (data.spotPerpDiv) score += 6;
    if (data.lsRatioExtreme) score += 6;

    // 4. Momentum (0-15)
    if (data.momentumDiv) score += 8;
    if (data.roundingPattern) score += 7;

    // 5. Timing (0-10)
    if (data.usOpenUnderstood) score += 5;
    if (data.eventRiskPriced) score += 5;

    // 6. Psychology (0-10)
    if (data.calmState) score += 5;
    if (data.invalidationClear) score += 5;
    if (data.anxietyFOMO) score -= 10; // Penalty

    return score;
  };

  const score = useMemo(() => calculateScore(), [data]);

  return (
    <div className="pb-20">

       <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="text-steel hover:text-ink flex items-center gap-2 text-sm font-mono">
                <ArrowLeft className="w-4 h-4" /> Back to Gates
            </button>
            <div className="bg-paper border border-ink px-4 py-2 rounded-sm flex items-center gap-3">
                <span className="text-steel text-xs font-mono uppercase tracking-wider">Current Score:</span>
                <span className={`font-mono font-medium text-lg ${score >= 70 ? 'text-go' : score < 50 ? 'text-stop' : 'text-signal'}`}>
                    {score}
                </span>
            </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Section title="1. Market Alignment" range="0–20">
                <Checkbox label="BTC major + minor aligned" points="+10" checked={data.btcAligned} onChange={() => toggle('btcAligned')} />
                <Checkbox label="ETH confirms or weaker/stronger" points="+5" checked={data.ethConfirming} onChange={() => toggle('ethConfirming')} />
                <Checkbox label="Alt Relative Strength favors direction" points="+5" checked={data.altStrength} onChange={() => toggle('altStrength')} />
            </Section>

            <Section title="2. Structure & Location" range="0–25">
                <Checkbox label="At Liquidation Cluster" points="+10" checked={data.atLiqCluster} onChange={() => toggle('atLiqCluster')} />
                <Checkbox label="At S/R Confluence" points="+10" checked={data.atSRConfluence} onChange={() => toggle('atSRConfluence')} />
                <Checkbox label="Wick / False Break confirmed" points="+5" checked={data.wickFalseBreak} onChange={() => toggle('wickFalseBreak')} />
            </Section>

            <Section title="3. Derivatives & Flow" range="0–20">
                <Checkbox label="OI diverges from price" points="+8" checked={data.oiDivergence} onChange={() => toggle('oiDivergence')} />
                <Checkbox label="Spot vs Perp Divergence" points="+6" checked={data.spotPerpDiv} onChange={() => toggle('spotPerpDiv')} />
                <Checkbox label="LS Ratio extreme / rounding" points="+6" checked={data.lsRatioExtreme} onChange={() => toggle('lsRatioExtreme')} />
            </Section>

            <Section title="4. Momentum & Pattern" range="0–15">
                <Checkbox label="Divergence (RSI / MACD)" points="+8" checked={data.momentumDiv} onChange={() => toggle('momentumDiv')} />
                <Checkbox label="Rounding top/bottom / Failed breakout" points="+7" checked={data.roundingPattern} onChange={() => toggle('roundingPattern')} />
            </Section>

            <Section title="5. Timing & Context" range="0–10">
                <Checkbox label="US Open behavior understood" points="+5" checked={data.usOpenUnderstood} onChange={() => toggle('usOpenUnderstood')} />
                <Checkbox label="Weekend / Event risk priced in" points="+5" checked={data.eventRiskPriced} onChange={() => toggle('eventRiskPriced')} />
            </Section>

            <Section title="6. Psychological State" range="±10">
                <Checkbox label="Calm, no urgency" points="+5" checked={data.calmState} onChange={() => toggle('calmState')} />
                <Checkbox label="Clear invalidation defined" points="+5" checked={data.invalidationClear} onChange={() => toggle('invalidationClear')} />
                <div className="mt-2 pt-2 border-t border-steel-light">
                    <Checkbox label="Anxiety / FOMO" points="-10" checked={data.anxietyFOMO} onChange={() => toggle('anxietyFOMO')} isNegative />
                </div>
            </Section>
       </div>

       {/* Floating Action Bar */}
       <div className="fixed bottom-0 left-0 right-0 bg-paper border-t border-ink p-4 z-30">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xs text-steel font-mono uppercase tracking-wider">Total Score</span>
                    <span className="text-2xl font-mono font-medium text-ink">{score}/100</span>
                </div>

                {isRestricted && (
                     <div className="hidden md:flex items-center gap-2 text-signal text-sm font-mono border border-signal px-3 py-1 rounded-sm">
                        GATE 1 RESTRICTION ACTIVE (MAX 30% SIZE)
                     </div>
                )}

                <button
                    onClick={onNext}
                    className="bg-ink text-paper font-medium py-3 px-8 rounded-sm uppercase tracking-wide hover:bg-ink/85"
                >
                    Generate Plan
                </button>
            </div>
       </div>

    </div>
  );
}

function Section({ title, range, children }: { title: string, range?: string, children?: React.ReactNode }) {
    return (
        <div className="bg-paper border border-ink rounded-sm">
            <div className="flex items-baseline justify-between px-5 py-3 border-b border-steel-light">
                <h4 className="text-ink font-medium text-sm uppercase tracking-wide">{title}</h4>
                {range && <span className="text-steel font-mono text-xs">{range}</span>}
            </div>
            <div className="p-3 space-y-1">
                {children}
            </div>
        </div>
    )
}

function Checkbox({ label, points, checked, onChange, isNegative = false }: { label: string, points?: string, checked: boolean, onChange: () => void, isNegative?: boolean }) {
    const onClass = isNegative ? 'bg-stop border-stop' : 'bg-signal border-signal';
    return (
        <label
            onClick={(e) => {
                e.preventDefault();
                onChange();
            }}
            className={`flex items-center gap-3 cursor-pointer px-2 py-2 rounded-sm select-none ${checked ? 'bg-white' : 'hover:bg-white/60'}`}
        >
            <div className={`w-4 h-4 rounded-[2px] border flex items-center justify-center shrink-0
                ${checked ? `${onClass} text-white` : 'border-steel bg-white'}
            `}>
                {checked && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className={`flex-1 text-sm ${checked ? 'text-ink' : 'text-steel'}`}>{label}</span>
            {points && (
                <span className={`font-mono text-xs ${checked ? (isNegative ? 'text-stop' : 'text-ink') : 'text-steel-light'}`}>
                    {points}
                </span>
            )}
        </label>
    )
}
