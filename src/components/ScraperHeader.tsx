import React, { memo } from 'react';
import { Search, Play, Pause, RefreshCw, BarChart3, Activity, ShieldCheck } from 'lucide-react';

interface ScraperHeaderProps {
  inputUrl: string;
  setInputUrl: (val: string) => void;
  onScrape: (overrideUrl?: string) => void;
  isLoading: boolean;
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  refreshIntervalMs: number;
  setRefreshIntervalMs: (val: number) => void;
  lastLatency: number;
}

const PRESET_TOKENS = [
  { label: 'SelfMade (EpXtn6x...)', mint: 'EpXtn6xGoZ4Y45vRjiDUHSCGbBoJD5FaEqZbF98YswH1' },
  { label: 'dogwifpants (FtateF3...)', mint: 'FtateF34Xzawa91bpbVNdX72hZYo9cymRDYqBreHHbJi' },
  { label: 'Fartcoin', mint: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump' },
  { label: 'Griffain', mint: 'KENJSUYLASHUMfHyy5o4Hp2FdNqZg1AsUPhfH2kYpump' },
];

export const ScraperHeader: React.FC<ScraperHeaderProps> = memo(({
  inputUrl,
  setInputUrl,
  onScrape,
  isLoading,
  isStreaming,
  setIsStreaming,
  refreshIntervalMs,
  setRefreshIntervalMs,
  lastLatency,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onScrape();
    }
  };

  return (
    <header className="bg-[#0a0a0a] border border-[#222] rounded-xl p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#00ffa3] to-[#03e1ff] rounded-lg flex items-center justify-center shadow-md shadow-[#00ffa3]/20">
            <BarChart3 className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center">
                PUMP.FUN VOLUME SCRAPER
              </h1>
              <span className="bg-[#00ffa3]/10 text-[#00ffa3] border border-[#00ffa3]/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#00ffa3]" /> 100% Direct Scrape
              </span>
            </div>
            <p className="text-xs text-[#888]">
              High-precision real-time scraper (Stats & Audit: 5m, 1h, 6h, 24h, Buy/Sell Vol, Buyers/Sellers)
            </p>
          </div>
        </div>

        {/* 10ms Active Ticker & Stream Control */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-[#111] px-3 py-1.5 border border-[#222] rounded">
            <Activity className="w-3.5 h-3.5 text-[#00ffa3] animate-pulse" />
            <span className="text-[#00ffa3] font-bold font-mono text-[11px]">
              TICK INTERVAL: {refreshIntervalMs}ms
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              id="update-rate-select"
              value={refreshIntervalMs}
              onChange={(e) => setRefreshIntervalMs(Number(e.target.value))}
              className="bg-[#111] border border-[#333] text-[#00ffa3] font-mono text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-[#00ffa3]"
            >
              <option value={10}>10ms (Continuous)</option>
              <option value={50}>50ms</option>
              <option value={100}>100ms</option>
              <option value={500}>500ms</option>
              <option value={1000}>1000ms (1s)</option>
            </select>

            <button
              id="toggle-stream-btn"
              onClick={() => setIsStreaming(!isStreaming)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs transition-colors border ${
                isStreaming
                  ? 'bg-[#00ffa3]/10 text-[#00ffa3] border-[#00ffa3]/40'
                  : 'bg-[#111] text-[#888] border-[#333]'
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#00ffa3]" />
                  <span className="font-bold">STREAMING</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>PAUSED</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Target Token Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888]" />
          <input
            id="token-target-input"
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste Pump.fun URL (e.g. https://pump.fun/coin/EpXtn6xGoZ4Y45vRjiDUHSCGbBoJD5FaEqZbF98YswH1) or mint address..."
            className="w-full bg-[#050505] border border-[#222] hover:border-[#333] focus:border-[#00ffa3] rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-[#555] focus:outline-none transition-colors"
          />
        </div>
        <button
          id="scrape-now-btn"
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-[#00ffa3] hover:bg-[#00e692] text-black font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md shadow-[#00ffa3]/20 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Scraping...' : 'Scrape Volume'}</span>
        </button>
      </form>

      {/* Target Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs border-t border-[#222]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#888] text-[11px] uppercase tracking-widest font-mono">Targets:</span>
          {PRESET_TOKENS.map((preset) => (
            <button
              key={preset.mint}
              type="button"
              onClick={() => {
                setInputUrl(preset.mint);
                onScrape(preset.mint);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                inputUrl.includes(preset.mint)
                  ? 'bg-[#111] text-[#00ffa3] border-[#00ffa3]'
                  : 'bg-[#0a0a0a] hover:bg-[#151515] text-[#888] border-[#222]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {lastLatency > 0 && (
          <span className="text-[#555] font-mono text-[10px] uppercase">
            SCRAPE LATENCY: {lastLatency}ms
          </span>
        )}
      </div>
    </header>
  );
});
