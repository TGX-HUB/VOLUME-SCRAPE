import React, { useState } from 'react';
import { ScrapedTokenData } from '../types';
import { Copy, Check, Download, Search, Terminal, Database, Code2, Globe } from 'lucide-react';

interface RawDataViewerProps {
  token: ScrapedTokenData;
}

export const RawDataViewer: React.FC<RawDataViewerProps> = ({ token }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pumpCoin' | 'pumpTrades' | 'dex' | 'html'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [copied, setCopied] = useState(false);

  const getPayload = () => {
    switch (activeTab) {
      case 'pumpCoin':
        return token.raw?.pumpFunCoin || { message: 'No direct pump.fun coin payload' };
      case 'pumpTrades':
        return token.raw?.pumpFunTrades || { message: 'No direct pump.fun trades payload' };
      case 'dex':
        return token.raw?.dexScreener || { message: 'No DexScreener payload' };
      case 'html':
        return token.raw?.htmlScrape || { message: 'No HTML scrape payload' };
      case 'all':
      default:
        return token;
    }
  };

  const currentPayload = getPayload();
  const jsonString = JSON.stringify(currentPayload, null, 2);

  // Filter lines if search query is present
  const displayLines = searchFilter.trim()
    ? jsonString
        .split('\n')
        .filter((line) => line.toLowerCase().includes(searchFilter.toLowerCase()))
        .join('\n')
    : jsonString;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${token.symbol || 'token'}-scraped-${activeTab}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="raw-data-inspector" className="bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-[#222] bg-[#151515] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#03e1ff]" />
          <h3 className="text-xs font-bold text-[#03e1ff] uppercase tracking-widest font-mono">
            Raw Scrape Output Engine
          </h3>
          <span className="text-[10px] text-[#888] font-mono">
            [Scrapling Parser v2.4]
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-raw-json-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0a0a0a] hover:bg-[#222] text-[#e0e0e0] border border-[#333] text-xs font-mono transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#00ffa3]" />
                <span className="text-[#00ffa3]">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-[#888]" />
                <span>COPY JSON</span>
              </>
            )}
          </button>
          <button
            id="download-raw-json-btn"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0a0a0a] hover:bg-[#222] text-[#e0e0e0] border border-[#333] text-xs font-mono transition-colors"
          >
            <Download className="w-3 h-3 text-[#03e1ff]" />
            <span>EXPORT .JSON</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Strip */}
      <div className="p-4 bg-[#0a0a0a] border-b border-[#181818] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#111] p-1 rounded border border-[#222]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded text-xs font-mono transition-all ${
              activeTab === 'all'
                ? 'bg-[#00ffa3] text-black font-bold shadow'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Database className="w-3 h-3" /> Unified JSON
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pumpCoin')}
            className={`px-3 py-1 rounded text-xs font-mono transition-all ${
              activeTab === 'pumpCoin'
                ? 'bg-[#00ffa3] text-black font-bold shadow'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3 h-3" /> Pump.fun Coin API
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pumpTrades')}
            className={`px-3 py-1 rounded text-xs font-mono transition-all ${
              activeTab === 'pumpTrades'
                ? 'bg-[#00ffa3] text-black font-bold shadow'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3 h-3" /> Pump.fun Trades
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dex')}
            className={`px-3 py-1 rounded text-xs font-mono transition-all ${
              activeTab === 'dex'
                ? 'bg-[#03e1ff] text-black font-bold shadow'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Database className="w-3 h-3" /> DexScreener
            </span>
          </button>

          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1 rounded text-xs font-mono transition-all ${
              activeTab === 'html'
                ? 'bg-[#03e1ff] text-black font-bold shadow'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Globe className="w-3 h-3" /> HTML Scrape
            </span>
          </button>
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            placeholder="Filter JSON fields..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-[#050505] border border-[#222] focus:border-[#00ffa3] rounded pl-8 pr-3 py-1.5 text-xs text-[#00ffa3] placeholder-[#555] font-mono focus:outline-none"
          />
        </div>
      </div>

      {/* Raw Output Terminal Screen */}
      <div className="p-4 bg-[#050505] font-mono text-[11px] text-[#00ffa3] overflow-x-auto max-h-96 leading-relaxed selection:bg-[#00ffa3] selection:text-black">
        <pre className="whitespace-pre-wrap">
          {displayLines || '// No matching fields found in query'}
        </pre>
      </div>

      {/* Terminal footer status bar */}
      <div className="px-4 py-2 border-t border-[#181818] bg-[#0d0d0d] flex items-center justify-between text-[10px] text-[#555] font-mono uppercase tracking-widest">
        <span>Target: {token.raw?.scrapedUrl || `https://pump.fun/coin/${token.mint}`}</span>
        <span className="text-[#00ffa3]">SCRAPE STATUS: 200 OK</span>
      </div>
    </section>
  );
};
