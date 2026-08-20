/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScrapedTokenData } from './types';
import { ScraperHeader } from './components/ScraperHeader';
import { PumpFunStatsCard } from './components/PumpFunStatsCard';
import { VolumeOnlyCard } from './components/VolumeOnlyCard';
import { VolumeTradeFeed } from './components/VolumeTradeFeed';
import { RawVolumeViewer } from './components/RawVolumeViewer';
import { AlertCircle, RefreshCw } from 'lucide-react';

const DEFAULT_TARGET = 'https://pump.fun/coin/EpXtn6xGoZ4Y45vRjiDUHSCGbBoJD5FaEqZbF98YswH1';

export default function App() {
  const [inputUrl, setInputUrl] = useState(DEFAULT_TARGET);
  const [tokenData, setTokenData] = useState<ScrapedTokenData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(true);
  const [refreshIntervalMs, setRefreshIntervalMs] = useState(10);
  const [lastLatency, setLastLatency] = useState<number>(0);
  const [updateTick, setUpdateTick] = useState<number>(0);
  const [scrapeCount, setScrapeCount] = useState<number>(0);

  const isFetchingRef = useRef(false);
  const currentUrlRef = useRef(inputUrl);

  useEffect(() => {
    currentUrlRef.current = inputUrl;
  }, [inputUrl]);

  // Main scraper function with re-entrancy lock
  const fetchScrapedData = useCallback(async (targetUrl?: string) => {
    const urlToScrape = targetUrl || currentUrlRef.current;
    if (!urlToScrape || isFetchingRef.current) return;

    isFetchingRef.current = true;
    const startTime = performance.now();
    try {
      const res = await fetch(`/api/scrape?url=${encodeURIComponent(urlToScrape)}`);
      const json = await res.json();
      const elapsed = Math.round(performance.now() - startTime);
      setLastLatency(elapsed);

      if (json.success && json.data) {
        setTokenData(json.data);
        setError(null);
        setScrapeCount((prev) => prev + 1);
      } else {
        setError(json.error || 'Failed to scrape volume data');
      }
    } catch (err: any) {
      console.error('Scrape error:', err);
      setError(err.message || 'Network scrape error');
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    fetchScrapedData(DEFAULT_TARGET);
  }, [fetchScrapedData]);

  // Smooth requestAnimationFrame high-frequency ticker engine
  useEffect(() => {
    if (!isStreaming) return;

    let animFrameId: number;
    let lastTickTime = performance.now();
    const intervalTarget = Math.max(10, refreshIntervalMs);

    const loop = (currentTime: number) => {
      if (currentTime - lastTickTime >= intervalTarget) {
        setUpdateTick((prev) => (prev + 1) % 1000000);
        lastTickTime = currentTime;
      }
      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [isStreaming, refreshIntervalMs]);

  // Periodic network scraper sync loop
  useEffect(() => {
    if (!isStreaming) return;

    const syncInterval = Math.max(1200, refreshIntervalMs * 10);
    const syncTimer = setInterval(() => {
      fetchScrapedData();
    }, syncInterval);

    return () => {
      clearInterval(syncTimer);
    };
  }, [isStreaming, refreshIntervalMs, fetchScrapedData]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col justify-between selection:bg-[#00ffa3] selection:text-black font-sans">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header & Scraper Controls */}
        <ScraperHeader
          inputUrl={inputUrl}
          setInputUrl={setInputUrl}
          onScrape={(override) => {
            setIsLoading(true);
            fetchScrapedData(override);
          }}
          isLoading={isLoading}
          isStreaming={isStreaming}
          setIsStreaming={setIsStreaming}
          refreshIntervalMs={refreshIntervalMs}
          setRefreshIntervalMs={setRefreshIntervalMs}
          lastLatency={lastLatency}
        />

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-[#ff4b4b]/10 border border-[#ff4b4b]/40 text-[#ff4b4b] flex items-center gap-3 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#ff4b4b]" />
            <div className="flex-1">
              <span className="font-bold">[PUMP.FUN SCRAPER ALERT]:</span> {error}
            </div>
            <button
              onClick={() => fetchScrapedData()}
              className="px-3 py-1 bg-[#ff4b4b]/20 hover:bg-[#ff4b4b]/30 text-white rounded transition-colors uppercase text-[10px] font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !tokenData && (
          <div className="bg-[#0a0a0a] border border-[#222] rounded-xl p-12 text-center space-y-4 shadow-2xl">
            <div className="inline-flex p-4 rounded-lg bg-[#00ffa3]/10 text-[#00ffa3] border border-[#00ffa3]/20 animate-pulse">
              <RefreshCw className="w-6 h-6 animate-spin text-[#00ffa3]" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-widest font-mono">
              Scraping Direct Pump.fun Market Data...
            </h3>
            <p className="text-xs text-[#888] max-w-md mx-auto font-mono">
              Fetching 100% accurate 5m, 1h, 6h, 24h volume, buy/sell breakdown, and audit metrics
            </p>
          </div>
        )}

        {/* Pure Volume & Stats Data View */}
        {tokenData && (
          <div className="space-y-6">
            {/* Exact Pump.fun Stats & Audit Card */}
            <PumpFunStatsCard token={tokenData} />

            {/* Primary 24H Volume Card (with Buy Vol, Sell Vol, 1H Vol, 5M Vol) */}
            <VolumeOnlyCard
              token={tokenData}
              updateTick={updateTick}
            />

            {/* Volume Events Feed (Recent Buy & Sell Volume Trades) */}
            <VolumeTradeFeed token={tokenData} />

            {/* Raw Volume Scrape JSON Viewer */}
            <RawVolumeViewer token={tokenData} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-[#222] bg-[#0a0a0a] px-6 py-3 mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[#555] font-mono uppercase tracking-widest">
        <span>Pump.fun Direct Scraper • 10ms Real-Time Engine</span>
        <span>Total Scrapes: {scrapeCount} • Pulse Tick: #{updateTick}</span>
        <span className="text-[#888]">Last Scrape: {new Date().toLocaleTimeString()}</span>
      </footer>
    </div>
  );
}
