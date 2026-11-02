import React, { useState, useEffect } from 'react';
import { GateData, ScoreData, MonitorState, TrendState, LocationType, Timeframe } from '../types';
import RulesReference from './RulesReference';

interface Props {
  gates: GateData;
  scores: ScoreData;
  isRestricted: boolean;
  onReset: () => void;
}

const INITIAL_MONITOR: MonitorState = {
  rrReached: false,
  structureInvalid: false,
  regimeChange: false,
  spotFlowFlip: false,
  scoreDrop: false,
  overChecking: false,
  revengeUrge: false,
  stressHigh: false,
};

export default function ResultCard({ gates, scores, isRestricted, onReset }: Props) {
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [monitor, setMonitor] = useState<MonitorState>(INITIAL_MONITOR);

  // Logic needed for Position Sizing (copied from before for consistency)
  const calculateScore = () => {
    let s = 0;
    if (scores.btcAligned) s += 10;
    if (scores.ethConfirming) s += 5;
    if (scores.altStrength) s += 5;
    if (scores.atLiqCluster) s += 10;
    if (scores.atSRConfluence) s += 10;
    if (scores.wickFalseBreak) s += 5;
    if (scores.oiDivergence) s += 8;
    if (scores.spotPerpDiv) s += 6;
    if (scores.lsRatioExtreme) s += 6;
    if (scores.momentumDiv) s += 8;
    if (scores.roundingPattern) s += 7;
    if (scores.usOpenUnderstood) s += 5;
    if (scores.eventRiskPriced) s += 5;
    if (scores.calmState) s += 5;
    if (scores.invalidationClear) s += 5;
    if (scores.anxietyFOMO) s -= 10;
    return s;
  };
  const score = calculateScore();

  // Verdict Logic
  let positionSize = "NO TRADE";
  let color = "red";
  let canTrade = false;

  if (score >= 70) {
    positionSize = "FULL POSITION";
    color = "green";
    canTrade = true;
  } else if (score >= 60) {
    positionSize = "HALF POSITION";
    color = "blue";
    canTrade = true;
  } else if (score >= 50) {
    positionSize = "PROBE ONLY (≤20%)";
    color = "yellow";
    canTrade = true;
  } else {
    positionSize = "NO TRADE (< 50)";
    color = "red";
    canTrade = false;
  }

  if (isRestricted && canTrade) {
    positionSize = "MAX 30% (Regime Unclear)";
    color = "orange";
  }

  // Status dot on the readout: green = full size, orange = reduced size
  const dotClass = color === 'green' ? 'bg-go' : 'bg-signal';

  // Execution Mode Logic
  let entryType = "Limit or Market";
  if (gates.location === LocationType.WICK_EXTREME) {
    entryType = "Limit at Wick + SL at wick end";
  } else if (gates.marketPhase === MarketPhase.REBOUND || gates.btcMajorTrend !== gates.btcMinorTrend) {
    entryType = "Grid ONLY (Counter-trend)";
  } else {
    entryType = "Limit or Market (Trend Confirmed)";
  }

  // --- MONITOR LOGIC ---
  const toggleMonitor = (key: keyof MonitorState) => {
    setMonitor(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const exitCount =
    (monitor.structureInvalid ? 1 : 0) +
    (monitor.regimeChange ? 1 : 0) +
    (monitor.spotFlowFlip ? 1 : 0) +
    (monitor.scoreDrop ? 1 : 0);

  const isCircuitBroken = monitor.overChecking || monitor.revengeUrge || monitor.stressHigh;

  let monitorAction = "HOLD PATIENCE";
  let monitorBorder = "border-steel-light";
  let monitorDot = "bg-steel";
  let monitorText = "text-ink";
  let monitorDesc = "No action signals yet. Stick to the plan.";

  if (isCircuitBroken) {
    monitorAction = "EMERGENCY CLOSE / REDUCE";
    monitorBorder = "border-stop";
    monitorDot = "bg-stop";
    monitorText = "text-stop";
    monitorDesc = "Psychological or process circuit breaker tripped. Protect capital immediately.";
  } else if (exitCount >= 2) {
    monitorAction = "FULL EXIT";
    monitorBorder = "border-signal";
    monitorDot = "bg-signal";
    monitorText = "text-signal";
    monitorDesc = "Two or more invalidation criteria met. The trade premise is broken.";
  } else if (monitor.rrReached) {
    monitorAction = "TAKE PROFIT (50%) & BREAKEVEN";
    monitorBorder = "border-go";
    monitorDot = "bg-go";
    monitorText = "text-go";
    monitorDesc = "Secure the bag. Risk is now zero. Let the rest ride.";
  }

  // --- RENDER ---

  if (!canTrade) {
     return (
        <div className="space-y-8">
             <div className="rounded-sm border border-stop bg-paper overflow-hidden">
                 <div className="p-6 text-center bg-stop text-white">
                    <h2 className="text-2xl md:text-3xl font-medium uppercase tracking-widest">{positionSize}</h2>
                    <div className="mt-2 font-mono text-sm opacity-80">SCORE: {score} / 100</div>
                 </div>
                 <div className="p-8 text-center text-steel">
                    <p className="mb-4">Score is too low to justify risk.</p>
                    <p>Preserve capital. Wait for a better setup.</p>
                 </div>
             </div>
             <div className="flex justify-center pt-8">
                <button onClick={onReset} className="text-steel hover:text-ink font-mono text-sm uppercase tracking-wide">
                    Start New Analysis
                </button>
            </div>
        </div>
     )
  }

  return (
    <div className="space-y-8 pb-20">

        {/* Trade Plan Header / Monitor Status */}
        <div className="rounded-sm border border-ink bg-paper overflow-hidden">

            {/* Top Banner */}
            {!isPositionOpen ? (
                // PLAN MODE BANNER — the readout
                <div className="p-6 text-center bg-ink text-paper">
                    <h2 className="text-2xl md:text-3xl font-medium uppercase tracking-widest flex items-center justify-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} aria-hidden="true"></span>
                        {positionSize}
                    </h2>
                    <div className="mt-2 font-mono text-sm opacity-70">SCORE: {score} / 100</div>
                </div>
            ) : (
                // MONITOR MODE BANNER (ACTION)
                <div className={`p-6 text-center border-b ${monitorBorder}`}>
                    <h2 className={`text-2xl md:text-3xl font-medium uppercase tracking-widest flex items-center justify-center gap-3 ${monitorText}`}>
                        <span className={`w-2.5 h-2.5 rounded-full ${monitorDot}`} aria-hidden="true"></span>
                        {monitorAction}
                    </h2>
                    <p className="mt-2 font-mono text-sm text-steel">{monitorDesc}</p>
                </div>
            )}

            {/* Content Body */}
            <div className="p-6 md:p-8">

                {/* 1. EXECUTION DETAILS (Always visible, but smaller in monitor mode) */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isPositionOpen ? 'opacity-50 hover:opacity-100 mb-8 border-b border-steel-light pb-6' : 'mb-8'}`}>
                     <div>
                        <h4 className="text-steel text-xs font-mono uppercase tracking-wider mb-2">Execution Mode</h4>
                        <div className="text-lg text-ink">
                            {entryType}
                        </div>
                    </div>
                     <div>
                        <h4 className="text-steel text-xs font-mono uppercase tracking-wider mb-2">SL Strategy</h4>
                        <div className="text-lg text-ink">
                             Beyond Structure & Liquidation
                        </div>
                    </div>
                </div>

                {/* 2. MODE SWITCHER */}
                {!isPositionOpen ? (
                    <div className="space-y-6">
                        <div className="bg-white/60 border border-steel-light rounded-sm p-4">
                             <h4 className="text-steel text-xs font-mono uppercase tracking-wider mb-2">Pre-Entry Checklist</h4>
                             <ul className="list-disc list-inside text-steel space-y-1 text-sm">
                                <li>Is the spread reasonable?</li>
                                <li>Is the size calculated correctly based on SL distance?</li>
                                <li>Are you entering at the level planned?</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => {
                                setIsPositionOpen(true);
                                window.scrollTo(0, 0);
                            }}
                            className="w-full py-4 bg-ink text-paper rounded-sm font-medium text-xl uppercase tracking-widest hover:bg-ink/85"
                        >
                            POSITION OPENED — START MONITOR
                        </button>

                        <div className="pt-4">
                            <RulesReference simpleMode={true} />
                        </div>
                    </div>
                ) : (
                    // 3. MONITOR INTERFACE
                    <div className="space-y-8">

                        {/* Part IV: Management */}
                        <div className="bg-white/50 border border-steel-light rounded-sm p-5">
                             <h3 className="font-mono font-medium text-sm text-ink uppercase tracking-wide mb-4 pb-2 border-b border-steel-light">
                                Part IV: Management Checks
                             </h3>
                             <MonitorCheckbox
                                checked={monitor.rrReached}
                                onChange={() => toggleMonitor('rrReached')}
                                label="R:R ≥ 1:1 OR Critical Zone Reached"
                                subLabel="Action: TP 50% immediately & Move SL to Breakeven."
                             />
                        </div>

                        {/* Part V: Exit Rules */}
                        <div className="bg-white/50 border border-steel-light rounded-sm p-5">
                             <h3 className="font-mono font-medium text-sm text-ink uppercase tracking-wide mb-4 pb-2 border-b border-steel-light">
                                Part V: Exit Triggers (2+ = FULL EXIT)
                             </h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <MonitorCheckbox checked={monitor.structureInvalid} onChange={() => toggleMonitor('structureInvalid')} label="Structural Invalidation" />
                                <MonitorCheckbox checked={monitor.regimeChange} onChange={() => toggleMonitor('regimeChange')} label="BTC Regime Change" />
                                <MonitorCheckbox checked={monitor.spotFlowFlip} onChange={() => toggleMonitor('spotFlowFlip')} label="Spot Flow Flip (Bearish)" />
                                <MonitorCheckbox checked={monitor.scoreDrop} onChange={() => toggleMonitor('scoreDrop')} label="Score Drops < 50" />
                             </div>
                             {exitCount > 0 && (
                                <div className="mt-3 text-right text-sm font-mono text-steel">
                                    Current Exit Count: <span className={exitCount >= 2 ? "text-stop font-medium" : "text-ink"}>{exitCount}/4</span>
                                </div>
                             )}
                        </div>

                         {/* Part VI: Circuit Breakers */}
                         <div className="bg-white/50 border border-steel-light rounded-sm p-5">
                             <h3 className="font-mono font-medium text-sm text-stop uppercase tracking-wide mb-4 pb-2 border-b border-steel-light">
                                Part VI: Circuit Breakers (ANY = CLOSE)
                             </h3>
                             <div className="space-y-2">
                                <MonitorCheckbox checked={monitor.overChecking} onChange={() => toggleMonitor('overChecking')} label="Checking chart >3 times in 30 mins" isAlert />
                                <MonitorCheckbox checked={monitor.revengeUrge} onChange={() => toggleMonitor('revengeUrge')} label="Urge to 'make back' money / Revenge trade" isAlert />
                                <MonitorCheckbox checked={monitor.stressHigh} onChange={() => toggleMonitor('stressHigh')} label="High financial stress / Anxiety" isAlert />
                             </div>
                        </div>

                    </div>
                )}

            </div>
        </div>

        <div className="flex justify-center pt-8 pb-12">
            <button
                onClick={onReset}
                className="text-steel hover:text-ink font-mono text-sm uppercase tracking-wide"
            >
                Reset / New Trade
            </button>
        </div>
    </div>
  );
}

// Helper Component for Monitor Checkboxes
function MonitorCheckbox({
    label,
    subLabel,
    checked,
    onChange,
    isAlert = false
}: {
    label: string,
    subLabel?: string,
    checked: boolean,
    onChange: () => void,
    isAlert?: boolean
}) {
    const onClass = isAlert ? 'bg-stop border-stop' : 'bg-signal border-signal';
    return (
        <label
            onClick={(e) => { e.preventDefault(); onChange(); }}
            className={`flex items-start gap-3 p-3 rounded-sm border cursor-pointer select-none
            ${checked
                ? (isAlert ? 'border-stop bg-white' : 'border-ink bg-white')
                : 'bg-paper border-steel-light hover:border-steel'
            }`}
        >
            <div className={`mt-0.5 w-4 h-4 rounded-[2px] flex items-center justify-center border shrink-0
                ${checked ? `${onClass} text-white` : 'border-steel bg-white'}
            `}>
                {checked && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <div>
                <div className={`text-sm ${checked ? 'text-ink' : 'text-steel'}`}>
                    {label}
                </div>
                {subLabel && checked && (
                    <div className="text-xs text-steel mt-1 font-mono">
                        {subLabel}
                    </div>
                )}
            </div>
        </label>
    )
}

// Importing Enum needed for Logic
import { MarketPhase } from '../types';
