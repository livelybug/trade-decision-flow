import React from 'react';

export default function RulesReference({ simpleMode = false }: { simpleMode?: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

        {/* Part IV: Position Management */}
        <div className="bg-paper border border-ink rounded-sm p-5">
            <h4 className="font-mono font-medium text-ink text-sm uppercase tracking-wide mb-3 pb-2 border-b border-steel-light">
                Part IV: Management (The Leak Fix)
            </h4>
            <div className="space-y-4 text-steel">
                <div>
                    <strong className="text-ink font-medium block mb-1">Mandatory Partial TP</strong>
                    <p>Once <span className="text-go font-mono font-medium">R:R ≥ 1:1</span> OR Critical Zone hit:</p>
                    <ul className="list-disc list-inside pl-2 mt-1 space-y-0.5">
                        <li>TP 50% immediately</li>
                        <li>Move remaining to Breakeven</li>
                        <li className="text-stop">Full close NOT allowed here</li>
                    </ul>
                </div>
                <div>
                    <strong className="text-ink font-medium block mb-1">Hold Rules (Anti-Anxiety)</strong>
                    <ul className="list-disc list-inside pl-2">
                        <li>Price between zones → NO ACTION</li>
                        <li>1H signal conflicts with 2H/4H → IGNORE</li>
                        <li>Anxiety? Check score. If ≥60, do nothing.</li>
                    </ul>
                </div>
            </div>
        </div>

        {/* Part V & VI */}
        <div className="space-y-6">
            <div className="bg-paper border border-ink rounded-sm p-5">
                <h4 className="font-mono font-medium text-ink text-sm uppercase tracking-wide mb-3 pb-2 border-b border-steel-light">
                    Part V: Exit Rules
                </h4>
                <p className="text-steel mb-2 text-xs font-mono uppercase tracking-wide">Full exit ONLY if 2+ occur:</p>
                <ul className="space-y-1 text-steel">
                    <li className="flex gap-2"><span className="font-mono text-ink">1.</span> Structural invalidation</li>
                    <li className="flex gap-2"><span className="font-mono text-ink">2.</span> BTC regime change</li>
                    <li className="flex gap-2"><span className="font-mono text-ink">3.</span> Spot flow flips against you</li>
                    <li className="flex gap-2"><span className="font-mono text-ink">4.</span> Score drops below 50</li>
                </ul>
            </div>

            {!simpleMode && (
                <div className="bg-paper border border-ink rounded-sm p-5">
                    <h4 className="font-mono font-medium text-stop text-sm uppercase tracking-wide mb-3 pb-2 border-b border-steel-light">
                        Part VI: Circuit Breakers
                    </h4>
                    <ul className="space-y-2 text-steel">
                        <li className="flex items-start gap-2">
                            <span className="text-stop">•</span>
                            Checking chart &gt;3 times in 30 mins → Close or reduce.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-stop">•</span>
                            Need to "get back money" → No trade today.
                        </li>
                         <li className="flex items-start gap-2">
                            <span className="text-stop">•</span>
                            High financial stress → Cap risk.
                        </li>
                    </ul>
                </div>
            )}
        </div>
    </div>
  );
}
