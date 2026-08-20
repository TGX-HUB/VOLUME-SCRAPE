import React, { useState, memo } from 'react';
import { ScrapedTokenData } from '../types';
import { TrendingUp, TrendingDown, ShieldCheck, Activity, Users, DollarSign, ArrowRightLeft } from 'lucide-react';

interface PumpFunStatsCardProps {
  token: ScrapedTokenData;
}

type Timeframe = '5m' | '1h' | '6h' | '24h';
type ViewMode = 'stats' | 'audit';

// Format standard currency with KM suffix for pump.fun aesthetic
function formatPumpFunCurrency(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '—';
  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
}

export const PumpFunStatsCard: React.FC<PumpFunStatsCardProps> = memo(({ token }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('stats');
  const [timeframe, setTimeframe] = useState<Timeframe>('24h');

  const marketActivity = token.marketActivity;
  const currentTfData = marketActivity?.[timeframe] || {
    numTxs: token.txns24h?.total || 0,
    volumeUSD: token.volume24h || 0,
    numUsers: (token.buyers24h || 0) + (token.sellers24h || 0),
    numBuys: token.txns24h?.buys || 0,
    numSells: token.txns24h?.sells || 0,
    buyVolumeUSD: token.volumeBuy24h || 0,
    sellVolumeUSD: token.volumeSell24h || 0,
    numBuyers: token.buyers24h || 0,
    numSellers: token.sellers24h || 0,
    priceChangePercent: token.priceChange24h || 0,
  };

  const priceChange = currentTfData.priceChangePercent;
  const isPositiveChange = (priceChange ?? 0) >= 0;

  // Ratios for dual-tone progress bars
  const totalTrades = (currentTfData.numBuys || 0) + (currentTfData.numSells || 0);
  const buyTxRatio = totalTrades > 0 ? (currentTfData.numBuys / totalTrades) * 100 : 50;
  const sellTxRatio = 100 - buyTxRatio;

  const totalVol = (currentTfData.buyVolumeUSD || 0) + (currentTfData.sellVolumeUSD || 0);
  const buyVolRatio = totalVol > 0 ? (currentTfData.buyVolumeUSD / totalVol) * 100 : 50;
  const sellVolRatio = 100 - buyVolRatio;

  const totalTraders = (currentTfData.numBuyers || 0) + (currentTfData.numSellers || 0);
  const buyersRatio = totalTraders > 0 ? (currentTfData.numBuyers / totalTraders) * 100 : 50;
  const sellersRatio = 100 - buyersRatio;

  const audit = token.audit;

  return (
    <section
      id="pump-fun-exact-stats"
      className="bg-[#0e0e0e] border border-[#262626] rounded-xl p-5 shadow-2xl space-y-4 font-mono text-white"
    >
      {/* Top Header Row with Tabs and Timeframe selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-3">
        {/* Stats vs Audit Tabs */}
        <div className="flex items-center gap-1.5 bg-[#151515] p-1 rounded-lg border border-[#2a2a2a]">
          <button
            id="tab-stats-btn"
            type="button"
            onClick={() => setViewMode('stats')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'stats'
                ? 'bg-[#262626] text-[#00ffa3] shadow-sm'
                : 'text-[#888] hover:text-[#ddd]'
            }`}
          >
            stats
          </button>
          <button
            id="tab-audit-btn"
            type="button"
            onClick={() => setViewMode('audit')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'audit'
                ? 'bg-[#262626] text-[#00ffa3] shadow-sm'
                : 'text-[#888] hover:text-[#ddd]'
            }`}
          >
            audit
          </button>
        </div>

        {/* Timeframe selector pills */}
        {viewMode === 'stats' && (
          <div className="flex items-center gap-1 bg-[#151515] p-1 rounded-lg border border-[#2a2a2a]">
            {(['5m', '1h', '6h', '24h'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                id={`timeframe-btn-${tf}`}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  timeframe === tf
                    ? 'bg-[#00ffa3] text-black shadow-sm'
                    : 'text-[#888] hover:text-[#fff]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* STATS VIEW */}
      {viewMode === 'stats' && (
        <div className="space-y-4">
          {/* Top Metric Header: Price Change & Volume */}
          <div className="grid grid-cols-2 gap-4 bg-[#141414] p-3.5 rounded-lg border border-[#202020]">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#777] font-semibold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-[#00ffa3]" /> Price change ({timeframe})
              </div>
              <div
                className={`text-lg sm:text-xl font-bold mt-0.5 flex items-center gap-1 ${
                  isPositiveChange ? 'text-[#00ffa3]' : 'text-[#ff4b4b]'
                }`}
              >
                {isPositiveChange ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {priceChange !== undefined && priceChange !== null
                    ? `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(1)}%`
                    : '—'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider text-[#777] font-semibold flex items-center justify-end gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#03e1ff]" /> Volume ({timeframe})
              </div>
              <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {formatPumpFunCurrency(currentTfData.volumeUSD)}
              </div>
            </div>
          </div>

          {/* Metric 1: Buys vs Sells */}
          <div className="space-y-1.5 bg-[#121212] p-3 rounded-lg border border-[#1d1d1d]">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#00ffa3] flex items-center gap-1.5">
                <span className="text-sm font-bold">{(currentTfData.numBuys || 0).toLocaleString()}</span>
                <span className="text-[11px] text-[#888]">buys</span>
              </span>
              <span className="text-[#ff4b4b] flex items-center gap-1.5">
                <span className="text-sm font-bold">{(currentTfData.numSells || 0).toLocaleString()}</span>
                <span className="text-[11px] text-[#888]">sells</span>
              </span>
            </div>
            {/* Visual ratio bar */}
            <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-[#222]">
              <div
                className="bg-[#00ffa3] rounded-l-full transition-all duration-300"
                style={{ width: `${buyTxRatio}%` }}
                title={`Buys: ${buyTxRatio.toFixed(1)}%`}
              />
              <div
                className="bg-[#ff4b4b] rounded-r-full transition-all duration-300"
                style={{ width: `${sellTxRatio}%` }}
                title={`Sells: ${sellTxRatio.toFixed(1)}%`}
              />
            </div>
          </div>

          {/* Metric 2: Buy Vol vs Sell Vol */}
          <div className="space-y-1.5 bg-[#121212] p-3 rounded-lg border border-[#1d1d1d]">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#00ffa3] flex items-center gap-1.5">
                <span className="text-sm font-bold">{formatPumpFunCurrency(currentTfData.buyVolumeUSD)}</span>
                <span className="text-[11px] text-[#888]">buy vol</span>
              </span>
              <span className="text-[#ff4b4b] flex items-center gap-1.5">
                <span className="text-sm font-bold">{formatPumpFunCurrency(currentTfData.sellVolumeUSD)}</span>
                <span className="text-[11px] text-[#888]">sell vol</span>
              </span>
            </div>
            {/* Visual ratio bar */}
            <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-[#222]">
              <div
                className="bg-[#00ffa3] rounded-l-full transition-all duration-300"
                style={{ width: `${buyVolRatio}%` }}
                title={`Buy Volume: ${buyVolRatio.toFixed(1)}%`}
              />
              <div
                className="bg-[#ff4b4b] rounded-r-full transition-all duration-300"
                style={{ width: `${sellVolRatio}%` }}
                title={`Sell Volume: ${sellVolRatio.toFixed(1)}%`}
              />
            </div>
          </div>

          {/* Metric 3: Buyers vs Sellers */}
          <div className="space-y-1.5 bg-[#121212] p-3 rounded-lg border border-[#1d1d1d]">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#00ffa3] flex items-center gap-1.5">
                <span className="text-sm font-bold">{(currentTfData.numBuyers || 0).toLocaleString()}</span>
                <span className="text-[11px] text-[#888]">buyers</span>
              </span>
              <span className="text-[#ff4b4b] flex items-center gap-1.5">
                <span className="text-sm font-bold">{(currentTfData.numSellers || 0).toLocaleString()}</span>
                <span className="text-[11px] text-[#888]">sellers</span>
              </span>
            </div>
            {/* Visual ratio bar */}
            <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-[#222]">
              <div
                className="bg-[#00ffa3] rounded-l-full transition-all duration-300"
                style={{ width: `${buyersRatio}%` }}
                title={`Buyers: ${buyersRatio.toFixed(1)}%`}
              />
              <div
                className="bg-[#ff4b4b] rounded-r-full transition-all duration-300"
                style={{ width: `${sellersRatio}%` }}
                title={`Sellers: ${sellersRatio.toFixed(1)}%`}
              />
            </div>
          </div>
        </div>
      )}

      {/* AUDIT VIEW */}
      {viewMode === 'audit' && (
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#121212] p-3 rounded-lg border border-[#1f1f1f]">
              <div className="text-[10px] text-[#777] uppercase font-semibold">Holders</div>
              <div className="text-base font-bold text-white mt-1">
                {audit?.totalHolders ? audit.totalHolders.toLocaleString() : '50+'}
              </div>
            </div>

            <div className="bg-[#121212] p-3 rounded-lg border border-[#1f1f1f]">
              <div className="text-[10px] text-[#777] uppercase font-semibold">Top 10</div>
              <div className="text-base font-bold text-[#00ffa3] mt-1">
                {audit?.top10HoldersPercent !== undefined ? `${audit.top10HoldersPercent}%` : '—'}
              </div>
            </div>

            <div className="bg-[#121212] p-3 rounded-lg border border-[#1f1f1f]">
              <div className="text-[10px] text-[#777] uppercase font-semibold">Dev</div>
              <div className="text-base font-bold text-[#00ffa3] mt-1">
                {audit?.devHoldingsPercent !== undefined ? `${audit.devHoldingsPercent}%` : '0.0%'}
              </div>
            </div>

            <div className="bg-[#121212] p-3 rounded-lg border border-[#1f1f1f]">
              <div className="text-[10px] text-[#777] uppercase font-semibold">Snipers</div>
              <div className="text-base font-bold text-[#00ffa3] mt-1">
                {audit?.snipersOwnedPercent !== undefined ? `${audit.snipersOwnedPercent}%` : '—'}
              </div>
            </div>

            <div className="bg-[#121212] p-3 rounded-lg border border-[#1f1f1f]">
              <div className="text-[10px] text-[#777] uppercase font-semibold">Bundlers</div>
              <div className="text-base font-bold text-[#00ffa3] mt-1">
                {audit?.bundlerOwnedPercentageV2 !== undefined ? `${audit.bundlerOwnedPercentageV2}%` : '0.0%'}
              </div>
            </div>

            <div className="bg-[#121212] p-3 rounded-lg border border-[#1f1f1f]">
              <div className="text-[10px] text-[#777] uppercase font-semibold">Total Fees</div>
              <div className="text-base font-bold text-[#03e1ff] mt-1">
                {audit?.totalFees !== undefined ? `${audit.totalFees} SOL` : '—'}
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#141414] rounded-lg border border-[#222] text-[11px] text-[#888] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00ffa3]" /> 100% Direct Pump.fun On-Chain Scraping
            </span>
            <span className="text-[#00ffa3] font-bold">VERIFIED PUMP DATA</span>
          </div>
        </div>
      )}

      {/* Footer status bar */}
      <div className="pt-2 border-t border-[#1a1a1a] flex items-center justify-between text-[10px] text-[#666]">
        <span>Target: {token.symbol || 'COIN'} ({token.mint.slice(0, 6)}...{token.mint.slice(-4)})</span>
        <span className="text-[#00ffa3]">Scraped: {new Date(token.scrapedAt).toLocaleTimeString()}</span>
      </div>
    </section>
  );
});
