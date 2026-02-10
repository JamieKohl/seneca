export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  timestamp: number;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockSearchResult {
  symbol: string;
  description: string;
  type: string;
}

export interface PortfolioHolding {
  id: string;
  symbol: string;
  quantity: number;
  avgCostBasis: number;
  purchaseDate: string;
  currentPrice?: number;
  marketValue?: number;
  totalCost?: number;
  pnl?: number;
  pnlPercent?: number;
  dayChange?: number;
  dayChangePercent?: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalPnl: number;
  totalPnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
  holdingsCount: number;
}

export interface Signal {
  id: string;
  symbol: string;
  signalType: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  technicalData?: TechnicalData;
  sentimentScore?: number;
  createdAt: string;
  expiresAt?: string;
}

export interface TechnicalData {
  rsi: number;
  macd: { value: number; signal: number; histogram: number };
  bollingerBands: { upper: number; middle: number; lower: number };
  sma20: number;
  sma50: number;
  ema12: number;
  ema26: number;
  volume: number;
  avgVolume: number;
}

export interface NewsArticle {
  id: string;
  symbol: string;
  headline: string;
  summary?: string;
  sentiment?: "bullish" | "bearish" | "neutral";
  sentimentScore?: number;
  source?: string;
  url?: string;
  publishedAt?: string;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  quote?: StockQuote;
}

export interface Notification {
  id: string;
  type: "signal" | "price" | "news" | "system";
  title: string;
  body: string;
  symbol?: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AIAnalysis {
  symbol: string;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  technicalSummary: string;
  sentimentSummary: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  priceTarget?: number;
  stopLoss?: number;
}
