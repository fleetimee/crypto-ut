export interface Crypto {
  id: string;
  symbol: string;
  name: string;
  rank: number;
  price_usd: string;
  percent_change_24h: string;
  market_cap_usd: string;
  volume24: string; // Change from number to string
  percent_change_1h: string;
  percent_change_7d: string;
  volume24_native: string;
  csupply: string;
  tsupply: string;
  msupply: string;
  price_btc: string;
  image?: string;
}

export interface CryptoResponse {
  data: Crypto[];
}

export interface GlobalStats {
  coins_count: number;
  total_mcap: number;
  total_volume: number;
  btc_d: string;
  eth_d: string;
  mcap_change: string;
}

export interface CoinGeckoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
}
