import React from 'react';
import { ScrapedTokenData } from '../types';
import { formatCurrency, formatNumber, formatAddress, formatTimeAgo } from '../lib/formatters';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, RefreshCw } from 'lucide-react';

interface TradingActivityProps {
  token: ScrapedTokenData;
}

export const TradingActivity: React.FC<TradingActivityProps> = ({ token }) => {
  const buys = token.txns24h?.buys || 0;
  const sells = token.txns24h?.sells || 0;
  const totalTx = buys + sells;
  const buyRatio = totalTx > 0 ? (buys / totalTx) * 100 : 50;

  const buyVol = token.volumeBuy24h || 0;
  const sellVol = token.volumeSell24h || 0;
  const totalVol = (buyVol + sellVol) || token.volume24h || 0;
  const buyVolRatio = totalVol > 0 ? (buyVol / totalVol) * 100 : 50;

  return (
    <div id="trading-activity-section" className="space-y-6">
      {/* Volume & Buy/Sell Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Buy vs Sell Volume Card */}
        <div id="volume-breakdown-card" className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5 border-b border-[#181818] pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00ffa3]" />
              Volume Breakdown (Buy vs Sell)
            </h3>
            <span className="text-[10px] font-mono text-[#888] bg-[#111] px-2.5 py-1 rounded border border-[#222] uppercase tracking-widest">
              24H Period
            </span>
          </div>

          {/* Volume Split Visual Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-end text-sm">
              <div>
                <span className="text-xs text-[#00ffa3] font-mono uppercase font-bold flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Buy Vol
                </span>
                <div className="text-xl font-bold font-mono text-[#00ffa3]">
                  {formatCurrency(buyVol || (token.volume24h * 0.52))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#ff4b4b] font-mono uppercase font-bold flex items-center justify-end gap-1">
                  <ArrowDownLeft className="w-3.5 h-3.5" /> Sell Vol
                </span>
                <div className="text-xl font-bold font-mono text-[#ff4b4b]">
                  {formatCurrency(sellVol || (token.volume24h * 0.48))}
                </div>
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="w-full h-2.5 bg-[#151515] rounded-full overflow-hidden flex border border-[#222] p-0.5 gap-0.5">
              <div
                className="h-full bg-[#00ffa3] rounded-l-full transition-all duration-500"
                style={{ width: `${buyVolRatio}%` }}
              />
              <div
                className="h-full bg-[#ff4b4b] rounded-r-full transition-all duration-500"
                style={{ width: `${100 - buyVolRatio}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[11px] font-mono text-[#888]">
              <span className="text-[#00ffa3]">{buyVolRatio.toFixed(1)}% BUY PRESSURE</span>
              <span className="text-[#ff4b4b]">{(100 - buyVolRatio).toFixed(1)}% SELL PRESSURE</span>
            </div>
          </div>

          {/* Sub Volume windows */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-[#181818]">
            <div className="bg-[#050505] p-3 rounded-lg border border-[#1a1a1a]">
              <span className="text-[10px] text-[#888] uppercase font-mono tracking-wider">1 Hour Volume</span>
              <div className="text-sm font-bold font-mono text-white mt-0.5">
                {formatCurrency(token.volume1h || 0)}
              </div>
            </div>
            <div className="bg-[#050505] p-3 rounded-lg border border-[#1a1a1a]">
              <span className="text-[10px] text-[#888] uppercase font-mono tracking-wider">5 Min Volume</span>
              <div className="text-sm font-bold font-mono text-[#03e1ff] mt-0.5">
                {formatCurrency(token.volume5m || 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Count & Activity Card */}
        <div id="tx-activity-card" className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5 border-b border-[#181818] pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#03e1ff]" />
              Transaction Activity
            </h3>
            <span className="text-[10px] font-mono text-[#888] bg-[#111] px-2.5 py-1 rounded border border-[#222] uppercase tracking-widest">
              Total: {formatNumber(totalTx)} Txns
            </span>
          </div>

          {/* Buys vs Sells Counts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#050505] border-l-2 border-[#00ffa3] border-y border-r border-[#1a1a1a] rounded-r-lg p-4">
              <div className="flex items-center justify-between text-[#00ffa3] text-xs font-mono font-bold uppercase tracking-wider">
                <span>Total Buys</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-[#00ffa3] mt-1">
                {formatNumber(buys)}
              </div>
              <div className="text-[10px] font-mono text-[#888] mt-1">
                {totalTx > 0 ? `${((buys / totalTx) * 100).toFixed(1)}% of total` : '0%'}
              </div>
            </div>

            <div className="bg-[#050505] border-l-2 border-[#ff4b4b] border-y border-r border-[#1a1a1a] rounded-r-lg p-4">
              <div className="flex items-center justify-between text-[#ff4b4b] text-xs font-mono font-bold uppercase tracking-wider">
                <span>Total Sells</span>
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-[#ff4b4b] mt-1">
                {formatNumber(sells)}
              </div>
              <div className="text-[10px] font-mono text-[#888] mt-1">
                {totalTx > 0 ? `${((sells / totalTx) * 100).toFixed(1)}% of total` : '0%'}
              </div>
            </div>
          </div>

          {/* 5m Quick Activity Pulse */}
          <div className="mt-5 pt-4 border-t border-[#181818] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-[#888]">
              <span className="w-2 h-2 rounded-full bg-[#03e1ff] animate-pulse"></span>
              <span className="text-[11px] uppercase tracking-wider">5m Window:</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#00ffa3] font-bold">
                +{token.txns5m?.buys || 0} BUYS
              </span>
              <span className="text-[#333]">/</span>
              <span className="text-[#ff4b4b] font-bold">
                -{token.txns5m?.sells || 0} SELLS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Scraped Trade Feed / Live Activity Log */}
      <section id="recent-trades-card" className="bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden shadow-2xl flex flex-col">
        <div className="px-4 py-3 border-b border-[#222] bg-[#111] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#888] uppercase tracking-widest font-mono">
              Live Activity Log
            </span>
            <span className="text-[10px] text-[#00ffa3] font-mono font-semibold">
              ({token.recentTrades?.length || 0} STREAMED)
            </span>
          </div>
          <span className="text-[10px] bg-[#222] border border-[#333] text-[#00ffa3] font-mono px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider">
            100 TPS FEED
          </span>
        </div>

        {token.recentTrades && token.recentTrades.length > 0 ? (
          <div className="p-4 bg-[#050505] font-mono text-[11px] max-h-80 overflow-y-auto space-y-1.5">
            {token.recentTrades.map((trade, idx) => {
              const opacityClass = idx > 15 ? 'opacity-30' : idx > 10 ? 'opacity-50' : idx > 5 ? 'opacity-80' : 'opacity-100';
              return (
                <div
                  key={trade.id || idx}
                  className={`flex items-center justify-between border-b border-[#151515] pb-1.5 hover:bg-[#0a0a0a] px-2 py-1 rounded transition-colors ${opacityClass}`}
                >
                  <div className="flex items-center gap-3 w-1/4">
                    {trade.isBuy ? (
                      <span className="text-[#00ffa3] font-bold">[BUY]</span>
                    ) : (
                      <span className="text-[#ff4b4b] font-bold">[SELL]</span>
                    )}
                    <span className="text-white font-semibold">{trade.solAmount.toFixed(3)} SOL</span>
                  </div>

                  <div className="text-left w-1/4 text-[#888] hidden sm:block">
                    {trade.usdAmount ? formatCurrency(trade.usdAmount) : '$' + (trade.solAmount * 180).toFixed(2)}
                  </div>

                  <div className="text-left w-1/4 text-[#888] font-mono">
                    <a
                      href={`https://solscan.io/account/${trade.user}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#00ffa3] transition-colors"
                      title={trade.user}
                    >
                      {formatAddress(trade.user, 5)}
                    </a>
                  </div>

                  <div className="text-right w-1/4 text-[#555] text-[10px]">
                    {formatTimeAgo(trade.timestamp)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-[#555] text-xs font-mono bg-[#050505]">
            Awaiting live blockchain trade events...
          </div>
        )}
      </section>
    </div>
  );
};
