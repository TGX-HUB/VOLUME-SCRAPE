export interface PumpMarketActivityTimeframe {
  numTxs: number;
  volumeUSD: number;
  numUsers: number;
  numBuys: number;
  numSells: number;
  buyVolumeUSD: number;
  sellVolumeUSD: number;
  numBuyers: number;
  numSellers: number;
  priceChangePercent: number;
}

export interface PumpMarketActivity {
  '5m'?: PumpMarketActivityTimeframe;
  '1h'?: PumpMarketActivityTimeframe;
  '6h'?: PumpMarketActivityTimeframe;
  '24h'?: PumpMarketActivityTimeframe;
}

export interface TopHolder {
  address: string;
  amount: number;
  isDev: boolean;
  isSniper: boolean;
  isBundler: boolean;
  enteredAt?: number;
  fundingSource?: any;
}

export interface PumpAuditData {
  totalHolders?: number;
  top10HoldersPercent?: number;
  devHoldingsPercent?: number;
  snipersOwnedPercent?: number;
  bundlerOwnedPercentageV2?: number;
  totalFees?: number;
  topHolders?: TopHolder[];
}

export interface TradeItem {
  id?: string;
  txHash?: string;
  isBuy: boolean;
  solAmount: number;
  tokenAmount: number;
  usdAmount?: number;
  priceUsd?: number;
  priceSol?: number;
  user: string;
  timestamp: number;
  slotIndexId?: string;
}

export interface ScrapedTokenData {
  mint: string;
  name: string;
  symbol: string;
  description?: string;
  imageUri?: string;
  priceUsd: number;
  priceSol: number;
  marketCap: number;
  marketCapSol?: number;
  volume24h: number;
  volume1h?: number;
  volume5m?: number;
  volume6h?: number;
  volumeBuy24h?: number;
  volumeSell24h?: number;
  txns24h?: {
    buys: number;
    sells: number;
    total: number;
  };
  txns5m?: {
    buys: number;
    sells: number;
  };
  txns1h?: {
    buys: number;
    sells: number;
  };
  txns6h?: {
    buys: number;
    sells: number;
  };
  buyers24h?: number;
  sellers24h?: number;
  priceChange24h?: number;
  priceChange1h?: number;
  priceChange5m?: number;
  priceChange6h?: number;
  marketActivity?: PumpMarketActivity;
  audit?: PumpAuditData;
  bondingCurveProgress?: number;
  isComplete?: boolean;
  raydiumPool?: string | null;
  creator?: string;
  createdTimestamp?: number;
  website?: string;
  twitter?: string;
  telegram?: string;
  replyCount?: number;
  sniperCount?: number;
  numKolsTraded?: number;
  totalFeesSol?: number;
  recentTrades?: TradeItem[];
  scrapedAt: string;
  source: 'pump.fun (100% Pure Direct Scraper)' | 'pump.fun';
  raw: {
    marketActivity?: PumpMarketActivity;
    inMemoryCoin?: any;
    topHolders?: any;
    pumpFunCoin?: any;
    pumpFunTrades?: any;
    htmlScrape?: any;
    scrapedUrl: string;
    fetchedAt: number;
  };
}
