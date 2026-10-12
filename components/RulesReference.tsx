import React from 'react';

export default function RulesReference({ simpleMode = false }: { simpleMode?: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        
        {/* Part IV: Position Management */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="font-bold text-blue-400 uppercase tracking-wide mb-3 border-b border-slate-800 pb-2">
                Part IV: Management (The Leak Fix)
            </h4>
            <div className="space-y-4 text-slate-300">
                <div>
                    <strong className="text-white block mb-1">Mandatory Partial TP</strong>
                    <p>Once <span className="text-green-400 font-bold">R:R ≥ 1:1</span> OR Critical Zone hit:</p>
                    <ul className="list-disc list-inside pl-2 text-slate-400 mt-1">
                        <li>TP 50% immediately</li>
                        <li>Move remaining to Breakeven</li>
                        <li className="text-red-400">Full close NOT allowed here</li>
                    </ul>
                </div>
                <div>
                    <strong className="text-white block mb-1">Hold Rules (Anti-Anxiety)</strong>
                    <ul className="list-disc list-inside pl-2 text-slate-400">
                        <li>Price between zones → NO ACTION</li>
                        <li>1H signal conflicts with 2H/4H → IGNORE</li>
                        <li>Anxiety? Check score. If ≥60, do nothing.</li>
                    </ul>
                </div>
            </div>
        </div>

        {/* Part V & VI */}
        <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h4 className="font-bold text-purple-400 uppercase tracking-wide mb-3 border-b border-slate-800 pb-2">
                    Part V: Exit Rules
                </h4>
                <p className="text-slate-400 mb-2 text-xs">Full exit ONLY if 2+ occur:</p>
                <ul className="space-y-1 text-slate-300">
                    <li className="flex gap-2"><span>1.</span> Structural invalidation</li>
                    <li className="flex gap-2"><span>2.</span> BTC regime change</li>
                    <li className="flex gap-2"><span>3.</span> Spot flow flips against you</li>
                    <li className="flex gap-2"><span>4.</span> Score drops below 50</li>
                </ul>
            </div>

            {!simpleMode && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <h4 className="font-bold text-red-400 uppercase tracking-wide mb-3 border-b border-slate-800 pb-2">
                        Part VI: Circuit Breakers
                    </h4>
                    <ul className="space-y-2 text-slate-300">
                        <li className="flex items-start gap-2">
                            <span className="text-red-500">•</span>
                            Checking chart &gt;3 times in 30 mins → Close or reduce.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500">•</span>
                            Need to "get back money" → No trade today.
                        </li>
                         <li className="flex items-start gap-2">
                            <span className="text-red-500">•</span>
                            High financial stress → Cap risk.
                        </li>
                    </ul>
                </div>
            )}
        </div>
    </div>
  );
}
