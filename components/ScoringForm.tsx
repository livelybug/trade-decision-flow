import React, { useMemo } from 'react';
import { ScoreData } from '../types';
import { ArrowLeft, Calculator, AlertCircle } from 'lucide-react';

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
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
       
       <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm">
                <ArrowLeft className="w-4 h-4" /> Back to Gates
            </button>
            <div className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-400" />
                <span className="text-slate-400 text-sm">Current Score:</span>
                <span className={`font-bold text-lg ${score >= 70 ? 'text-green-400' : score < 50 ? 'text-red-400' : 'text-yellow-400'}`}>
                    {score}
                </span>
            </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Section title="1. Market Alignment (0-20)">
                <Checkbox label="BTC major + minor aligned (+10)" checked={data.btcAligned} onChange={() => toggle('btcAligned')} />
                <Checkbox label="ETH confirms or weaker/stronger (+5)" checked={data.ethConfirming} onChange={() => toggle('ethConfirming')} />
                <Checkbox label="Alt Relative Strength favors direction (+5)" checked={data.altStrength} onChange={() => toggle('altStrength')} />
            </Section>

            <Section title="2. Structure & Location (0-25)">
                <Checkbox label="At Liquidation Cluster (+10)" checked={data.atLiqCluster} onChange={() => toggle('atLiqCluster')} />
                <Checkbox label="At S/R Confluence (+10)" checked={data.atSRConfluence} onChange={() => toggle('atSRConfluence')} />
                <Checkbox label="Wick / False Break confirmed (+5)" checked={data.wickFalseBreak} onChange={() => toggle('wickFalseBreak')} />
            </Section>

            <Section title="3. Derivatives & Flow (0-20)">
                <Checkbox label="OI diverges from price (+8)" checked={data.oiDivergence} onChange={() => toggle('oiDivergence')} />
                <Checkbox label="Spot vs Perp Divergence (+6)" checked={data.spotPerpDiv} onChange={() => toggle('spotPerpDiv')} />
                <Checkbox label="LS Ratio extreme / rounding (+6)" checked={data.lsRatioExtreme} onChange={() => toggle('lsRatioExtreme')} />
            </Section>

            <Section title="4. Momentum & Pattern (0-15)">
                <Checkbox label="Divergence (RSI / MACD) (+8)" checked={data.momentumDiv} onChange={() => toggle('momentumDiv')} />
                <Checkbox label="Rounding top/bottom / Failed breakout (+7)" checked={data.roundingPattern} onChange={() => toggle('roundingPattern')} />
            </Section>

            <Section title="5. Timing & Context (0-10)">
                <Checkbox label="US Open behavior understood (+5)" checked={data.usOpenUnderstood} onChange={() => toggle('usOpenUnderstood')} />
                <Checkbox label="Weekend / Event risk priced in (+5)" checked={data.eventRiskPriced} onChange={() => toggle('eventRiskPriced')} />
            </Section>

            <Section title="6. Psychological State">
                <Checkbox label="Calm, no urgency (+5)" checked={data.calmState} onChange={() => toggle('calmState')} />
                <Checkbox label="Clear invalidation defined (+5)" checked={data.invalidationClear} onChange={() => toggle('invalidationClear')} />
                <div className="pt-2 border-t border-slate-700/50 mt-2">
                    <Checkbox label="Anxiety / FOMO (-10 Penalty)" checked={data.anxietyFOMO} onChange={() => toggle('anxietyFOMO')} isNegative />
                </div>
            </Section>
       </div>

       {/* Floating Action Bar */}
       <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur border-t border-slate-800 p-4 z-30">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Total Score</span>
                    <span className="text-2xl font-bold text-white">{score}/100</span>
                </div>
                
                {isRestricted && (
                     <div className="hidden md:flex items-center gap-2 text-yellow-500 text-sm bg-yellow-900/20 px-3 py-1 rounded">
                        <AlertCircle className="w-4 h-4" />
                        Gate 1 Restriction Active (Max 30% Size)
                     </div>
                )}

                <button 
                    onClick={onNext}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all"
                >
                    Generate Plan
                </button>
            </div>
       </div>

    </div>
  );
}

function Section({ title, children }: { title: string, children?: React.ReactNode }) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <h4 className="text-slate-300 font-semibold mb-4 text-sm uppercase tracking-wide border-b border-slate-800 pb-2">{title}</h4>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    )
}

function Checkbox({ label, checked, onChange, isNegative = false }: { label: string, checked: boolean, onChange: () => void, isNegative?: boolean }) {
    return (
        <label 
            onClick={(e) => {
                e.preventDefault();
                onChange();
            }}
            className={`flex items-start gap-3 cursor-pointer group p-2 rounded hover:bg-slate-800/50 transition-colors select-none ${checked && isNegative ? 'bg-red-900/20' : ''} ${checked && !isNegative ? 'bg-blue-900/20' : ''}`}
        >
            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors 
                ${checked 
                    ? (isNegative ? 'bg-red-500 border-red-500 text-white' : 'bg-blue-500 border-blue-500 text-white') 
                    : 'border-slate-600 bg-slate-800 group-hover:border-slate-500'
                }`}>
                {checked && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className={`text-sm ${checked ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>{label}</span>
        </label>
    )
}