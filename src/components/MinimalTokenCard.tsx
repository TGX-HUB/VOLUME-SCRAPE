import React, { useEffect, useState, useRef } from 'react';
import { ScrapedTokenData } from '../types';
import { formatCurrency } from '../lib/formatters';
import { ArrowUpRight } from 'lucide-react';

interface MinimalTokenCardProps {
  token: ScrapedTokenData;
  lastUpdateTick: number;
  showDetailsToggle?: boolean;
  onToggleDetails?: () => void;
  isDetailedView?: boolean;
}

export const MinimalTokenCard: React.FC<MinimalTokenCardProps> = ({
  token,
  lastUpdateTick,
}) => {
  const prevMarketCap = useRef(token.marketCap);
  const prevVolume = useRef(token.volume24h);
  const [mcHighlight, setMcHighlight] = useState<'up' | 'down' | null>(null);
  const [volHighlight, setVolHighlight] = useState<boolean>(false);

  useEffect(() => {
    if (token.marketCap !== prevMarketCap.current) {
      setMcHighlight(token.marketCap > prevMarketCap.current ? 'up' : 'down');
      prevMarketCap.current = token.marketCap;
      const timer = setTimeout(() => setMcHighlight(null), 800);
      return () => clearTimeout(timer);
    }
  }, [token.marketCap]);

  useEffect(() => {
    if (token.volume24h !== prevVolume.current) {
      setVolHighlight(true);
      prevVolume.current = token.volume24h;
      const timer = setTimeout(() => setVolHighlight(false), 800);
      return () => clearTimeout(timer);
    }
  }, [token.volume24h]);

  return (
    <section id="minimal-token-summary" className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between transition-all duration-300">
      {/* Header with Active Token Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 border-b border-[#181818] pb-6">
        <div className="flex items-center gap-4 min-w-0">
          {token.imageUri ? (
            <img
              src={token.imageUri}
              alt={token.name}
              className="w-14 h-14 rounded-lg object-cover border border-[#333] shrink-0 bg-[#111]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#00ffa3]/20 to-[#03e1ff]/20 border border-[#00ffa3]/30 flex items-center justify-center shrink-0 text-[#00ffa3] font-bold text-xl font-mono">
              {token.symbol?.slice(0, 3) || 'S1'}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-[#888] uppercase text-xs tracking-widest mb-1 font-mono flex items-center gap-2">
              <span>Active Token</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ffa3] animate-pulse" />
              <span className="text-[#555]">•</span>
              <span className="text-[#00ffa3] font-mono">${token.symbol || 'TOKEN'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight truncate">
              {token.name || token.symbol || 'Loading Token...'}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="bg-[#111] px-2.5 py-1 border border-[#333] rounded text-xs font-mono text-[#00ffa3] inline-flex items-center gap-1.5">
                <span className="text-[#888]">MINT:</span>
                <span className="select-all">{token.mint}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0 flex flex-col sm:items-end">
          <div className="text-[#00ffa3] text-sm font-bold font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ffa3] animate-pulse inline-block" />
            LIVE TICK #{lastUpdateTick}
          </div>
          <div className="text-xs text-[#888] font-mono mt-1">
            Scraped: {new Date(token.scrapedAt).toLocaleTimeString()}
          </div>
          {token.priceUsd > 0 && (
            <div className="text-xs font-mono text-white font-semibold mt-1 bg-[#111] px-2 py-0.5 rounded border border-[#222]">
              ${token.priceUsd < 0.0001 ? token.priceUsd.toExponential(4) : token.priceUsd.toFixed(6)} USD
            </div>
          )}
        </div>
      </div>

      {/* High-Impact Metric Columns with Elegant Dark Neon Borders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
        {/* Market Cap */}
        <div
          id="metric-marketcap-card"
          className={`border-l-2 border-[#00ffa3] pl-6 bg-[#050505] p-5 rounded-r-xl border-y border-r border-[#1a1a1a] transition-all duration-300 ${
            mcHighlight === 'up'
              ? 'bg-[#00ffa3]/5 border-r-[#00ffa3]/40'
              : mcHighlight === 'down'
              ? 'bg-[#ff4b4b]/5 border-r-[#ff4b4b]/40'
              : ''
          }`}
        >
          <div className="text-[#888] text-xs uppercase tracking-tighter mb-1 font-mono">
            Market Cap
          </div>
          <div className={`text-4xl sm:text-5xl font-mono font-bold tracking-tight transition-colors duration-300 ${
            mcHighlight === 'up' ? 'text-[#00ffa3]' : mcHighlight === 'down' ? 'text-[#ff4b4b]' : 'text-white'
          }`}>
            {formatCurrency(token.marketCap)}
          </div>
          <div className="text-xs font-mono text-[#888] mt-2 flex items-center justify-between">
            <span>SOL: <span className="text-white font-semibold">{token.marketCapSol ? token.marketCapSol.toFixed(2) + ' SOL' : 'N/A'}</span></span>
            {token.bondingCurveProgress !== undefined && (
              <span className="text-[#00ffa3]">{token.bondingCurveProgress}% Curve</span>
            )}
          </div>
        </div>

        {/* 24h Volume */}
        <div
          id="metric-volume-card"
          className={`border-l-2 border-[#03e1ff] pl-6 bg-[#050505] p-5 rounded-r-xl border-y border-r border-[#1a1a1a] transition-all duration-300 ${
            volHighlight ? 'bg-[#03e1ff]/5 border-r-[#03e1ff]/40' : ''
          }`}
        >
          <div className="text-[#888] text-xs uppercase tracking-tighter mb-1 font-mono">
            24h Volume
          </div>
          <div className={`text-4xl sm:text-5xl font-mono font-bold tracking-tight transition-colors duration-300 ${
            volHighlight ? 'text-[#03e1ff]' : 'text-white'
          }`}>
            {formatCurrency(token.volume24h)}
          </div>
          <div className="text-xs font-mono text-[#888] mt-2 flex items-center justify-between">
            <span>1H: <span className="text-white font-semibold">{formatCurrency(token.volume1h || 0)}</span></span>
            <span>5M: <span className="text-[#03e1ff] font-semibold">{formatCurrency(token.volume5m || 0)}</span></span>
          </div>
        </div>
      </div>

      {/* Bottom info strip */}
      <div className="mt-6 pt-4 border-t border-[#181818] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#888]">
        <div className="flex items-center gap-3">
          {token.bondingCurveProgress !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-[#888] uppercase text-[10px] tracking-widest">Bonding Curve:</span>
              <div className="w-28 bg-[#151515] rounded-full h-1.5 overflow-hidden border border-[#222]">
                <div
                  className={`h-full transition-all duration-500 ${
                    token.isComplete ? 'bg-[#03e1ff]' : 'bg-[#00ffa3]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, token.bondingCurveProgress))}%` }}
                />
              </div>
              <span className="font-bold text-white">
                {token.bondingCurveProgress}%
              </span>
            </div>
          )}
          {token.isComplete && (
            <span className="px-2 py-0.5 rounded bg-[#03e1ff]/10 text-[#03e1ff] border border-[#03e1ff]/30 text-[10px] font-bold uppercase tracking-wider">
              Raydium Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`https://pump.fun/coin/${token.mint}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#00ffa3] hover:underline"
          >
            Pump.fun <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a
            href={`https://dexscreener.com/solana/${token.mint}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#03e1ff] hover:underline"
          >
            DexScreener <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
