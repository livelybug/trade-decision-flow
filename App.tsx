import React, { useState } from 'react';
import { GateData, ScoreData, Step, TrendState, MarketPhase, LocationType, Timeframe } from './types';
import GateForm from './components/GateForm';
import ScoringForm from './components/ScoringForm';
import ResultCard from './components/ResultCard';
import RulesReference from './components/RulesReference';

const INITIAL_GATES: GateData = {
  btcMajorTrend: TrendState.UNCLEAR,
  btcMinorTrend: TrendState.UNCLEAR,
  ethAligned: false,
  marketPhase: MarketPhase.UNCLEAR,
  location: LocationType.MIDDLE_OF_RANGE,
  timeframe: Timeframe.TF_4H,
};

const INITIAL_SCORES: ScoreData = {
  btcAligned: false,
  ethConfirming: false,
  altStrength: false,
  atLiqCluster: false,
  atSRConfluence: false,
  wickFalseBreak: false,
  oiDivergence: false,
  spotPerpDiv: false,
  lsRatioExtreme: false,
  momentumDiv: false,
  roundingPattern: false,
  usOpenUnderstood: false,
  eventRiskPriced: false,
  calmState: true,
  invalidationClear: false,
  anxietyFOMO: false,
};

export default function App() {
  const [step, setStep] = useState<Step>('GATES');
  const [gates, setGates] = useState<GateData>(INITIAL_GATES);
  const [scores, setScores] = useState<ScoreData>(INITIAL_SCORES);

  // Logic to determine if Gates are passed effectively
  const isGateRestricted =
    gates.btcMajorTrend === TrendState.UNCLEAR ||
    gates.btcMinorTrend === TrendState.UNCLEAR ||
    !gates.ethAligned ||
    gates.marketPhase === MarketPhase.UNCLEAR;

  const isGateFailed = gates.location === LocationType.MIDDLE_OF_RANGE;

  const handleReset = () => {
    setStep('GATES');
    setGates(INITIAL_GATES);
    setScores(INITIAL_SCORES);
    window.scrollTo(0,0);
  };

  return (
    <div className="min-h-screen text-ink font-sans pb-20">
      {/* Nameplate header */}
      <header className="border-b border-ink bg-paper sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Power dot — the single signal-orange indicator */}
            <span className="w-2.5 h-2.5 rounded-full bg-signal shrink-0" aria-hidden="true"></span>
            <div>
              <h1 className="text-lg font-medium uppercase tracking-wide">TradeFlow Protocol</h1>
              <p className="text-[11px] text-steel font-mono uppercase tracking-widest">Decision Support System</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-mono">
             <StepIndicator current={step} target="GATES" label="1. Gates" />
             <div className="w-6 md:w-8 h-px bg-steel-light"></div>
             <StepIndicator current={step} target="SCORING" label="2. Scoring" />
             <div className="w-6 md:w-8 h-px bg-steel-light"></div>
             <StepIndicator current={step} target="RESULT" label="3. Plan" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">

        {step === 'GATES' && (
          <GateForm
            data={gates}
            onChange={setGates}
            onNext={() => setStep('SCORING')}
            isRestricted={isGateRestricted}
            isFailed={isGateFailed}
          />
        )}

        {step === 'SCORING' && (
          <ScoringForm
            data={scores}
            onChange={setScores}
            onBack={() => setStep('GATES')}
            onNext={() => setStep('RESULT')}
            isRestricted={isGateRestricted}
          />
        )}

        {step === 'RESULT' && (
          <ResultCard
            gates={gates}
            scores={scores}
            isRestricted={isGateRestricted}
            onReset={handleReset}
          />
        )}

        {/* Static Reference Rules - Always Visible below fold unless in result mode where it is integrated */}
        {step !== 'RESULT' && (
           <div className="mt-12 pt-8 border-t border-steel-light">
              <RulesReference />
           </div>
        )}
      </main>
    </div>
  );
}

function StepIndicator({ current, target, label }: { current: Step, target: Step, label: string }) {
  const isActive = current === target;
  const isDone = (current === 'SCORING' && target === 'GATES') || (current === 'RESULT' && target !== 'RESULT');

  const textClass = isActive || isDone ? "text-ink" : "text-steel";
  const dotClass = isActive
    ? "bg-signal"
    : isDone
      ? "bg-ink"
      : "border border-steel-light";

  return (
    <div className={`flex items-center gap-1.5 ${textClass}`}>
      <span className={`w-2 h-2 rounded-full ${dotClass}`} aria-hidden="true"></span>
      <span className={isActive ? "text-ink" : ""}>{label}</span>
    </div>
  );
}
