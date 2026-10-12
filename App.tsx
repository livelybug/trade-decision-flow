import React, { useState } from 'react';
import { GateData, ScoreData, Step, TrendState, MarketPhase, LocationType, Timeframe } from './types';
import GateForm from './components/GateForm';
import ScoringForm from './components/ScoringForm';
import ResultCard from './components/ResultCard';
import RulesReference from './components/RulesReference';
import { ShieldCheck, Activity, BrainCircuit } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500 selection:text-white pb-20">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-20 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">TradeFlow Protocol</h1>
              <p className="text-xs text-slate-400">Decision Support System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-medium">
             <StepIndicator current={step} target="GATES" label="1. Gates" icon={<ShieldCheck className="w-4 h-4" />} />
             <div className="w-8 h-px bg-slate-700"></div>
             <StepIndicator current={step} target="SCORING" label="2. Scoring" icon={<Activity className="w-4 h-4" />} />
             <div className="w-8 h-px bg-slate-700"></div>
             <StepIndicator current={step} target="RESULT" label="3. Plan" icon={<BrainCircuit className="w-4 h-4" />} />
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
           <div className="mt-12 pt-8 border-t border-slate-800">
              <RulesReference />
           </div>
        )}
      </main>
    </div>
  );
}

function StepIndicator({ current, target, label, icon }: { current: Step, target: Step, label: string, icon: React.ReactNode }) {
  const isActive = current === target;
  const isDone = (current === 'SCORING' && target === 'GATES') || (current === 'RESULT' && target !== 'RESULT');
  
  let colorClass = "text-slate-600";
  if (isActive) colorClass = "text-blue-400";
  if (isDone) colorClass = "text-green-500";

  return (
    <div className={`flex items-center gap-1 ${colorClass}`}>
      {icon}
      <span className={isActive ? "text-slate-100" : ""}>{label}</span>
    </div>
  );
}
