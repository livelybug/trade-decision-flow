import React, { useState, useEffect } from 'react';
import { GateData, ScoreData, MonitorState, TrendState, LocationType, Timeframe } from '../types';
import { AlertOctagon, CheckCircle, RefreshCcw, ScrollText, Play, Activity, Siren, ShieldAlert, BadgeCent } from 'lucide-react';
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
  let monitorColor = "bg-slate-700";
  let monitorDesc = "No action signals yet. Stick to the plan.";

  if (isCircuitBroken) {
    monitorAction = "EMERGENCY CLOSE / REDUCE";
    monitorColor = "bg-red-600 animate-pulse";
    monitorDesc = "Psychological or process circuit breaker tripped. Protect capital immediately.";
  } else if (exitCount >= 2) {
    monitorAction = "FULL EXIT";
    monitorColor = "bg-orange-600";
    monitorDesc = "Two or more invalidation criteria met. The trade premise is broken.";
  } else if (monitor.rrReached) {
    monitorAction = "TAKE PROFIT (50%) & BREAKEVEN";
    monitorColor = "bg-green-600";
    monitorDesc = "Secure the bag. Risk is now zero. Let the rest ride.";
  }

  // --- RENDER ---

  if (!canTrade) {
     return (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
             <div className="rounded-xl border-2 border-red-500 bg-red-950/20 overflow-hidden shadow-2xl">
                 <div className="p-6 text-center bg-red-600 text-white">
                    <h2 className="text-3xl font-black uppercase tracking-widest">{positionSize}</h2>
                    <div className="mt-2 font-mono opacity-80">SCORE: {score} / 100</div>
                 </div>
                 <div className="p-8 text-center text-slate-300">
                    <p className="mb-4">Score is too low to justify risk.</p>
                    <p>Preserve capital. Wait for a better setup.</p>
                 </div>
             </div>
             <div className="flex justify-center pt-8">
                <button onClick={onReset} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <RefreshCcw className="w-4 h-4" /> Start New Analysis
                </button>
            </div>
        </div>
     )
  }

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 pb-20">
        
        {/* Trade Plan Header / Monitor Status */}
        <div className={`rounded-xl border-2 overflow-hidden shadow-2xl transition-all duration-500 ${
            isPositionOpen 
             ? (isCircuitBroken ? 'border-red-500 bg-red-950/30' : 'border-slate-600 bg-slate-900') 
             : (color === 'green' ? 'border-green-500 bg-green-950/20' : 
                color === 'blue' ? 'border-blue-500 bg-blue-950/20' :
                color === 'yellow' ? 'border-yellow-500 bg-yellow-950/20' :
                'border-orange-500 bg-orange-950/20')
        }`}>
            {/* Top Banner */}
            {!isPositionOpen ? (
                // PLAN MODE BANNER
                <div className={`p-6 text-center ${
                    color === 'green' ? 'bg-green-600' : 
                    color === 'blue' ? 'bg-blue-600' :
                    color === 'yellow' ? 'bg-yellow-600' :
                    'bg-orange-600'
                } text-white`}>
                    <h2 className="text-3xl font-black uppercase tracking-widest">{positionSize}</h2>
                    <div className="mt-2 font-mono opacity-80">SCORE: {score} / 100</div>
                </div>
            ) : (
                // MONITOR MODE BANNER (ACTION)
                <div className={`p-6 text-center ${monitorColor} text-white shadow-inner`}>
                    <h2 className="text-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3">
                        {isCircuitBroken && <Siren className="w-8 h-8" />}
                        {monitorAction}
                    </h2>
                    <p className="mt-2 font-medium opacity-90">{monitorDesc}</p>
                </div>
            )}

            {/* Content Body */}
            <div className="p-6 md:p-8">
                
                {/* 1. EXECUTION DETAILS (Always visible, but smaller in monitor mode) */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all ${isPositionOpen ? 'opacity-50 hover:opacity-100 mb-8 border-b border-slate-800 pb-6' : 'mb-8'}`}>
                     <div>
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Execution Mode</h4>
                        <div className="text-lg font-bold text-slate-100 flex items-center gap-2">
                            <AlertOctagon className="w-5 h-5 text-blue-400" />
                            {entryType}
                        </div>
                    </div>
                     <div>
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">SL Strategy</h4>
                        <div className="text-lg font-bold text-slate-100">
                             Beyond Structure & Liquidation
                        </div>
                    </div>
                </div>

                {/* 2. MODE SWITCHER */}
                {!isPositionOpen ? (
                    <div className="space-y-6">
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                             <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Pre-Entry Checklist</h4>
                             <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
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
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]"
                        >
                            <Play className="w-6 h-6 fill-current" />
                            POSITION OPENED — START MONITOR
                        </button>

                        <div className="pt-4">
                            <RulesReference simpleMode={true} />
                        </div>
                    </div>
                ) : (
                    // 3. MONITOR INTERFACE
                    <div className="space-y-8 animate-in fade-in duration-500">
                        
                        {/* Part IV: Management */}
                        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                             <h3 className="font-bold text-blue-400 flex items-center gap-2 mb-4">
                                <BadgeCent className="w-5 h-5" />
                                Part IV: Management Checks
                             </h3>
                             <MonitorCheckbox 
                                checked={monitor.rrReached}
                                onChange={() => toggleMonitor('rrReached')}
                                label="R:R ≥ 1:1 OR Critical Zone Reached"
                                subLabel="Action: TP 50% immediately & Move SL to Breakeven."
                                activeColor="text-green-400"
                             />
                        </div>

                        {/* Part V: Exit Rules */}
                        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                             <h3 className="font-bold text-orange-400 flex items-center gap-2 mb-4">
                                <ShieldAlert className="w-5 h-5" />
                                Part V: Exit Triggers (2+ = FULL EXIT)
                             </h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <MonitorCheckbox checked={monitor.structureInvalid} onChange={() => toggleMonitor('structureInvalid')} label="Structural Invalidation" />
                                <MonitorCheckbox checked={monitor.regimeChange} onChange={() => toggleMonitor('regimeChange')} label="BTC Regime Change" />
                                <MonitorCheckbox checked={monitor.spotFlowFlip} onChange={() => toggleMonitor('spotFlowFlip')} label="Spot Flow Flip (Bearish)" />
                                <MonitorCheckbox checked={monitor.scoreDrop} onChange={() => toggleMonitor('scoreDrop')} label="Score Drops < 50" />
                             </div>
                             {exitCount > 0 && (
                                <div className="mt-3 text-right text-sm font-mono text-slate-400">
                                    Current Exit Count: <span className={exitCount >= 2 ? "text-red-500 font-bold" : "text-slate-200"}>{exitCount}/4</span>
                                </div>
                             )}
                        </div>

                         {/* Part VI: Circuit Breakers */}
                         <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                             <h3 className="font-bold text-red-400 flex items-center gap-2 mb-4">
                                <Siren className="w-5 h-5" />
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
                className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
            >
                <RefreshCcw className="w-4 h-4" /> Reset / New Trade
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
    isAlert = false,
    activeColor
}: { 
    label: string, 
    subLabel?: string, 
    checked: boolean, 
    onChange: () => void, 
    isAlert?: boolean,
    activeColor?: string
}) {
    return (
        <label 
            onClick={(e) => { e.preventDefault(); onChange(); }}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none
            ${checked 
                ? (isAlert ? 'bg-red-900/30 border-red-500' : 'bg-slate-700 border-slate-500') 
                : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
            }`}
        >
            <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors
                ${checked
                    ? (isAlert ? 'bg-red-500 border-red-500 text-white' : 'bg-blue-500 border-blue-500 text-white')
                    : 'border-slate-600'
                }
            `}>
                {checked && <CheckCircle className="w-3.5 h-3.5" />}
            </div>
            <div>
                <div className={`text-sm font-medium ${checked ? (activeColor || 'text-white') : 'text-slate-300'}`}>
                    {label}
                </div>
                {subLabel && checked && (
                    <div className="text-xs text-slate-300 mt-1 font-mono">
                        {subLabel}
                    </div>
                )}
            </div>
        </label>
    )
}

// Importing Enum needed for Logic
import { MarketPhase } from '../types';
