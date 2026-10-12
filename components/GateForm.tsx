import React from 'react';
import { GateData, TrendState, MarketPhase, LocationType, Timeframe } from '../types';
import { AlertTriangle, Ban, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  data: GateData;
  onChange: (d: GateData) => void;
  onNext: () => void;
  isRestricted: boolean;
  isFailed: boolean;
}

export default function GateForm({ data, onChange, onNext, isRestricted, isFailed }: Props) {
  
  const update = (key: keyof GateData, value: any) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
            <Ban className="text-red-500 w-5 h-5" />
            PART I — Trade Eligibility Gate
        </h2>
        <p className="text-slate-400 text-sm">
            Hard filters. If a trade fails here, NO TRADE. No exceptions.
        </p>
      </div>

      {/* Gate 1 */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Gate 1: Market Regime</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="BTC Major Trend">
                <select 
                    value={data.btcMajorTrend} 
                    onChange={(e) => update('btcMajorTrend', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value={TrendState.UNCLEAR}>Unclear</option>
                    <option value={TrendState.UP}>Uptrend</option>
                    <option value={TrendState.DOWN}>Downtrend</option>
                    <option value={TrendState.RANGE}>Range</option>
                </select>
            </Field>

            <Field label="BTC Minor Trend">
                <select 
                    value={data.btcMinorTrend} 
                    onChange={(e) => update('btcMinorTrend', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value={TrendState.UNCLEAR}>Unclear</option>
                    <option value={TrendState.UP}>Uptrend</option>
                    <option value={TrendState.DOWN}>Downtrend</option>
                    <option value={TrendState.RANGE}>Range</option>
                </select>
            </Field>

             <Field label="Market Phase">
                <select 
                    value={data.marketPhase} 
                    onChange={(e) => update('marketPhase', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value={MarketPhase.UNCLEAR}>Unclear</option>
                    <option value={MarketPhase.ACCUMULATION}>Accumulation</option>
                    <option value={MarketPhase.DISTRIBUTION}>Distribution</option>
                    <option value={MarketPhase.CONTINUATION}>Trend Continuation</option>
                    <option value={MarketPhase.REBOUND}>Counter-trend Rebound</option>
                </select>
            </Field>

            <div className="flex items-center space-x-3 bg-slate-800 p-3 rounded-lg border border-slate-700 mt-6">
                <input 
                    type="checkbox" 
                    id="ethAligned"
                    checked={data.ethAligned}
                    onChange={(e) => update('ethAligned', e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-offset-slate-800"
                />
                <label htmlFor="ethAligned" className="text-sm font-medium text-slate-200 cursor-pointer">
                    ETH agrees with BTC <br/><span className="text-slate-500 text-xs font-normal">OR clearly weaker/stronger (not mixed)</span>
                </label>
            </div>
        </div>
        
        {isRestricted && (
            <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-200">
                    <strong>Regime Unclear:</strong> Position size will be capped at 30% automatically if you proceed.
                </p>
            </div>
        )}
      </div>

      {/* Gate 2 */}
      <div className={`bg-slate-900 border p-6 rounded-xl transition-colors ${isFailed ? 'border-red-600 shadow-red-900/20 shadow-lg' : 'border-slate-800'}`}>
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Gate 2: Location (Crucial)</h3>
        
        <Field label="Current Price Location">
            <select 
                value={data.location} 
                onChange={(e) => update('location', e.target.value)}
                className={`w-full bg-slate-800 border rounded-lg p-3 text-sm focus:ring-2 focus:outline-none ${isFailed ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-blue-500'}`}
            >
                <option value={LocationType.MIDDLE_OF_RANGE}>Middle of Range (Disqualified)</option>
                <option value={LocationType.MAJOR_SR}>Major S/R (Validated)</option>
                <option value={LocationType.LIQUIDATION_ZONE}>Liquidation Dense Zone</option>
                <option value={LocationType.TRENDLINE_RETEST}>Trendline Retest</option>
                <option value={LocationType.WICK_EXTREME}>Wick Extreme / Failed Break</option>
            </select>
        </Field>

        {isFailed && (
            <div className="mt-4 p-4 bg-red-950/50 border border-red-800 rounded flex items-center gap-3">
                <Ban className="w-6 h-6 text-red-500" />
                <div className="text-red-200 font-bold">
                    TRADING FORBIDDEN IN MIDDLE OF RANGE.
                </div>
            </div>
        )}
      </div>

       {/* Gate 3 */}
       <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Gate 3: Timeframe</h3>
        <p className="text-xs text-slate-500 mb-3">Sets minimum decision & exit logic. Smaller TFs strictly forbidden for management.</p>
        
        <div className="grid grid-cols-3 gap-3">
            {[Timeframe.TF_1H, Timeframe.TF_2H, Timeframe.TF_4H].map(tf => (
                <button
                    key={tf}
                    onClick={() => update('timeframe', tf)}
                    className={`p-3 rounded-lg border text-sm font-bold transition-all ${data.timeframe === tf ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                >
                    {tf}
                </button>
            ))}
        </div>
        <div className="mt-2 text-xs text-slate-400">
            {data.timeframe === Timeframe.TF_1H && "Allowed for Counter-trend / Scalp only."}
            {data.timeframe === Timeframe.TF_2H && "Minimum for Trend trades."}
            {data.timeframe === Timeframe.TF_4H && "Minimum for Structural trades."}
        </div>
      </div>

      {/* Action */}
      <div className="pt-4 flex justify-end">
        <button 
            disabled={isFailed}
            onClick={onNext}
            className={`flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition-all
            ${isFailed 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' 
                : 'bg-green-600 hover:bg-green-500 text-white hover:shadow-green-900/20 transform hover:-translate-y-0.5'
            }`}
        >
            {isFailed ? 'DISQUALIFIED' : 'PASS GATES'}
            {!isFailed && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>

    </div>
  );
}

function Field({ label, children }: { label: string, children?: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">{label}</label>
            {children}
        </div>
    )
}