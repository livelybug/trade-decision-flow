import React from 'react';
import { GateData, TrendState, MarketPhase, LocationType, Timeframe } from '../types';
import { ArrowRight } from 'lucide-react';

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
    <div className="space-y-6">

      {/* Intro */}
      <div className="bg-paper border border-ink p-6 rounded-sm">
        <h2 className="text-lg font-medium text-ink uppercase tracking-wide">
            Part I — Trade Eligibility Gate
        </h2>
        <p className="text-steel text-sm mt-1">
            Hard filters. If a trade fails here, NO TRADE. No exceptions.
        </p>
      </div>

      {/* Gate 1 */}
      <div className="bg-paper border border-ink p-6 rounded-sm">
        <h3 className="text-base font-medium text-ink uppercase tracking-wide mb-4">Gate 1: Market Regime</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="BTC Major Trend">
                <select
                    value={data.btcMajorTrend}
                    onChange={(e) => update('btcMajorTrend', e.target.value)}
                    className="w-full bg-white border border-steel rounded-sm p-3 text-sm text-ink focus:border-ink focus:outline-none"
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
                    className="w-full bg-white border border-steel rounded-sm p-3 text-sm text-ink focus:border-ink focus:outline-none"
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
                    className="w-full bg-white border border-steel rounded-sm p-3 text-sm text-ink focus:border-ink focus:outline-none"
                >
                    <option value={MarketPhase.UNCLEAR}>Unclear</option>
                    <option value={MarketPhase.ACCUMULATION}>Accumulation</option>
                    <option value={MarketPhase.DISTRIBUTION}>Distribution</option>
                    <option value={MarketPhase.CONTINUATION}>Trend Continuation</option>
                    <option value={MarketPhase.REBOUND}>Counter-trend Rebound</option>
                </select>
            </Field>

            <div className="flex items-center space-x-3 bg-white border border-steel rounded-sm p-3 mt-6">
                <input
                    type="checkbox"
                    id="ethAligned"
                    checked={data.ethAligned}
                    onChange={(e) => update('ethAligned', e.target.checked)}
                    className="w-4 h-4 accent-signal"
                />
                <label htmlFor="ethAligned" className="text-sm text-ink cursor-pointer">
                    ETH agrees with BTC <br/><span className="text-steel text-xs">OR clearly weaker/stronger (not mixed)</span>
                </label>
            </div>
        </div>

        {isRestricted && (
            <div className="mt-4 p-3 border border-signal rounded-sm flex items-start gap-3">
                <p className="text-sm text-ink">
                    <span className="text-signal font-medium uppercase">Regime Unclear:</span>{' '}
                    Position size will be capped at 30% automatically if you proceed.
                </p>
            </div>
        )}
      </div>

      {/* Gate 2 */}
      <div className={`bg-paper border p-6 rounded-sm ${isFailed ? 'border-stop' : 'border-ink'}`}>
        <h3 className="text-base font-medium text-ink uppercase tracking-wide mb-4">Gate 2: Location (Crucial)</h3>

        <Field label="Current Price Location">
            <select
                value={data.location}
                onChange={(e) => update('location', e.target.value)}
                className={`w-full bg-white border rounded-sm p-3 text-sm text-ink focus:outline-none ${isFailed ? 'border-stop focus:border-stop' : 'border-steel focus:border-ink'}`}
            >
                <option value={LocationType.MIDDLE_OF_RANGE}>Middle of Range (Disqualified)</option>
                <option value={LocationType.MAJOR_SR}>Major S/R (Validated)</option>
                <option value={LocationType.LIQUIDATION_ZONE}>Liquidation Dense Zone</option>
                <option value={LocationType.TRENDLINE_RETEST}>Trendline Retest</option>
                <option value={LocationType.WICK_EXTREME}>Wick Extreme / Failed Break</option>
            </select>
        </Field>

        {isFailed && (
            <div className="mt-4 p-4 border border-stop rounded-sm flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-stop shrink-0" aria-hidden="true"></span>
                <div className="text-stop font-medium uppercase tracking-wide">
                    Trading forbidden in middle of range.
                </div>
            </div>
        )}
      </div>

       {/* Gate 3 */}
       <div className="bg-paper border border-ink p-6 rounded-sm">
        <h3 className="text-base font-medium text-ink uppercase tracking-wide mb-4">Gate 3: Timeframe</h3>
        <p className="text-xs text-steel mb-3 font-mono">Sets minimum decision & exit logic. Smaller TFs strictly forbidden for management.</p>

        <div className="grid grid-cols-3 gap-3">
            {[Timeframe.TF_1H, Timeframe.TF_2H, Timeframe.TF_4H].map(tf => (
                <button
                    key={tf}
                    onClick={() => update('timeframe', tf)}
                    className={`p-3 rounded-sm border font-mono text-sm font-medium ${data.timeframe === tf ? 'bg-ink border-ink text-paper' : 'bg-white border-steel text-steel hover:border-ink hover:text-ink'}`}
                >
                    {tf}
                </button>
            ))}
        </div>
        <div className="mt-2 text-xs text-steel font-mono">
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
            className={`flex items-center gap-2 px-8 py-4 rounded-sm font-medium text-lg uppercase tracking-wide
            ${isFailed
                ? 'bg-white border border-steel-light text-steel-light cursor-not-allowed'
                : 'bg-ink text-paper hover:bg-ink/85'
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
            <label className="text-xs font-mono uppercase text-steel tracking-wider">{label}</label>
            {children}
        </div>
    )
}
