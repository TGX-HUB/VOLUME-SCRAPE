import React, { memo } from 'react';
import { ScrapedTokenData } from '../types';
import { formatCurrency } from '../lib/formatters';
import { TrendingUp, TrendingDown, Clock, Layers } from 'lucide-react';

interface VolumeTradeFeedProps {
  token: ScrapedTokenData;
}

export const VolumeTradeFeed: React.FC<VolumeTradeFeedProps> = memo(({ token }) => {
  const trades = token.recentTrades || [];

  return (
    <section id="volume-trade-feed" className="bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden shadow-2xl">
      {/* Feed Header */}
      <div className="px-5 py-4 border-b border-[#222] bg-[#121212] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00ffa3]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
            Volume Ingestion Feed (Recent Trades)
          </h3>
        </div>
        <div className="text-[10px] text-[#888] font-mono flex items-center gap-3">
          <span className="text-[#00ffa3] flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffa3] animate-pulse" /> LIVE STREAM
          </span>
          <span>{trades.length} Volume Events</span>
        </div>
      </div>

      {/* Trade Rows */}
      <div className="divide-y divide-[#151515] max-h-80 overflow-y-auto font-mono text-xs">
        {trades.length === 0 ? (
          <div className="p-8 text-center text-[#555]">
            No live volume trades recorded in current buffer.
          </div>
        ) : (
          trades.map((trade, idx) => {
            const isBuy = trade.isBuy;
            return (
              <div
                key={trade.id || idx}
                className="px-5 py-3 hover:bg-[#111] transition-colors flex items-center justify-between gap-4"
              >
                {/* Left: Type & Time */}
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      isBuy
                        ? 'bg-[#00ffa3]/10 text-[#00ffa3] border border-[#00ffa3]/30'
                        : 'bg-[#ff4b4b]/10 text-[#ff4b4b] border border-[#ff4b4b]/30'
                    }`}
                  >
                    {isBuy ? (
                      <>
                        <TrendingUp className="w-3 h-3" /> BUY VOL
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3 h-3" /> SELL VOL
                      </>
                    )}
                  </span>
                  <span className="text-[#888] text-[11px] truncate">
                    Wallet: <span className="text-[#bbb]">{trade.user?.slice(0, 4)}...{trade.user?.slice(-4)}</span>
                  </span>
                </div>

                {/* Right: Volume values in USD & SOL */}
                <div className="text-right shrink-0">
                  <div className={`font-bold text-sm ${isBuy ? 'text-[#00ffa3]' : 'text-[#ff4b4b]'}`}>
                    {isBuy ? '+' : '-'}{formatCurrency(trade.usdAmount || 0)}
                  </div>
                  <div className="text-[10px] text-[#555] flex items-center justify-end gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{trade.solAmount?.toFixed(2)} SOL</span>
                    <span>•</span>
                    <span>{new Date(trade.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer bar */}
      <div className="px-5 py-2.5 bg-[#0d0d0d] border-t border-[#181818] text-[10px] text-[#666] font-mono flex items-center justify-between">
        <span>Target: {token.mint}</span>
        <span className="text-[#00ffa3]">Continuous 10ms Ingestion Enabled</span>
      </div>
    </section>
  );
});
