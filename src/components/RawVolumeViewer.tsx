import React, { useState, memo } from 'react';
import { ScrapedTokenData } from '../types';
import { Copy, Check, Download, Terminal, Database, Code2, ShieldCheck } from 'lucide-react';

interface RawVolumeViewerProps {
  token: ScrapedTokenData;
}

export const RawVolumeViewer: React.FC<RawVolumeViewerProps> = memo(({ token }) => {
  const [activeTab, setActiveTab] = useState<'marketActivity' | 'inMemoryCoin' | 'audit' | 'trades'>('marketActivity');
  const [copied, setCopied] = useState(false);

  // Extract strictly volume-relevant payload
  const getVolumePayload = () => {
    switch (activeTab) {
      case 'marketActivity':
        return {
          mint: token.mint,
          tokenName: token.name,
          symbol: token.symbol,
          source: token.source,
          scrapedAt: token.scrapedAt,
          marketActivity: token.marketActivity || {
            '24h': {
              volumeUSD: token.volume24h,
              buyVolumeUSD: token.volumeBuy24h,
              sellVolumeUSD: token.volumeSell24h,
              numBuys: token.txns24h?.buys,
              numSells: token.txns24h?.sells,
              numBuyers: token.buyers24h,
              numSellers: token.sellers24h,
              priceChangePercent: token.priceChange24h,
            },
            '1h': {
              volumeUSD: token.volume1h,
              numBuys: token.txns1h?.buys,
              numSells: token.txns1h?.sells,
              priceChangePercent: token.priceChange1h,
            },
            '5m': {
              volumeUSD: token.volume5m,
              numBuys: token.txns5m?.buys,
              numSells: token.txns5m?.sells,
              priceChangePercent: token.priceChange5m,
            },
          },
        };
      case 'inMemoryCoin':
        return token.raw?.inMemoryCoin || {
          mint: token.mint,
          name: token.name,
          ticker: token.symbol,
          marketCapUsd: token.marketCap,
          volumeUsd: token.volume24h,
          currentMarketPrice: token.priceUsd,
          sniperCount: token.sniperCount,
          numKolsTraded: token.numKolsTraded,
          totalFeesSol: token.totalFeesSol,
        };
      case 'audit':
        return {
          totalHolders: token.audit?.totalHolders,
          top10HoldersPercent: token.audit?.top10HoldersPercent,
          devHoldingsPercent: token.audit?.devHoldingsPercent,
          snipersOwnedPercent: token.audit?.snipersOwnedPercent,
          bundlerOwnedPercentageV2: token.audit?.bundlerOwnedPercentageV2,
          totalFees: token.audit?.totalFees,
          topHoldersSample: token.audit?.topHolders?.slice(0, 10),
        };
      case 'trades':
        return {
          tradeCount: token.recentTrades?.length || 0,
          volumeTrades: token.recentTrades?.map((t) => ({
            type: t.isBuy ? 'buy' : 'sell',
            usdAmount: t.usdAmount,
            solAmount: t.solAmount,
            priceUsd: t.priceUsd,
            priceSol: t.priceSol,
            userAddress: t.user,
            timestamp: new Date(t.timestamp).toISOString(),
            tx: t.txHash,
          })),
        };
      default:
        return token;
    }
  };

  const payload = getVolumePayload();
  const jsonString = JSON.stringify(payload, null, 2);

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
    a.download = `${token.symbol || 'token'}-pump-scraped-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="raw-volume-inspector" className="bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-[#222] bg-[#151515] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00ffa3]" />
          <h3 className="text-xs font-bold text-[#00ffa3] uppercase tracking-widest font-mono">
            Direct Pump.fun Scraper Payload
          </h3>
          <span className="text-[10px] text-[#888] font-mono">
            [100% Pure Direct Data]
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-volume-json-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0a0a0a] hover:bg-[#222] text-[#e0e0e0] border border-[#333] text-xs font-mono transition-colors"
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
            id="download-volume-json-btn"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0a0a0a] hover:bg-[#222] text-[#e0e0e0] border border-[#333] text-xs font-mono transition-colors"
          >
            <Download className="w-3 h-3 text-[#03e1ff]" />
            <span>EXPORT .JSON</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-3 bg-[#0a0a0a] border-b border-[#181818] flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('marketActivity')}
          className={`px-3 py-1 rounded text-xs font-mono transition-all ${
            activeTab === 'marketActivity'
              ? 'bg-[#00ffa3] text-black font-bold shadow'
              : 'text-[#888] hover:text-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Database className="w-3 h-3" /> Market Activity (5m/1h/6h/24h)
          </span>
        </button>

        <button
          onClick={() => setActiveTab('inMemoryCoin')}
          className={`px-3 py-1 rounded text-xs font-mono transition-all ${
            activeTab === 'inMemoryCoin'
              ? 'bg-[#03e1ff] text-black font-bold shadow'
              : 'text-[#888] hover:text-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Code2 className="w-3 h-3" /> In-Memory Indexer Data
          </span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1 rounded text-xs font-mono transition-all ${
            activeTab === 'audit'
              ? 'bg-[#00ffa3] text-black font-bold shadow'
              : 'text-[#888] hover:text-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" /> Audit & Holders
          </span>
        </button>

        <button
          onClick={() => setActiveTab('trades')}
          className={`px-3 py-1 rounded text-xs font-mono transition-all ${
            activeTab === 'trades'
              ? 'bg-[#00ffa3] text-black font-bold shadow'
              : 'text-[#888] hover:text-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Database className="w-3 h-3" /> AMM Trade Stream
          </span>
        </button>
      </div>

      {/* Raw Output Terminal Screen */}
      <div className="p-4 bg-[#050505] font-mono text-[11px] text-[#00ffa3] overflow-x-auto max-h-72 leading-relaxed selection:bg-[#00ffa3] selection:text-black">
        <pre className="whitespace-pre-wrap">{jsonString}</pre>
      </div>

      {/* Terminal footer status bar */}
      <div className="px-4 py-2 border-t border-[#181818] bg-[#0d0d0d] flex items-center justify-between text-[10px] text-[#555] font-mono uppercase tracking-widest">
        <span>Target: {token.mint}</span>
        <span className="text-[#00ffa3]">STATUS: 200 OK • 100% PURE SCRAPED DATA</span>
      </div>
    </section>
  );
});
