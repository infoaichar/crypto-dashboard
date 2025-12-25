export interface CryptoPrice {
  usd: number;
  thb: number;
}

export interface CryptoPrices {
  bitcoin: CryptoPrice;
  ethereum: CryptoPrice;
}

export interface CryptoCardData {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  prices: CryptoPrice;
}