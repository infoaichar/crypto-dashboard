import { CryptoPrices } from '@/types/crypto';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export async function fetchCryptoPrices(): Promise<CryptoPrices> {
  const response = await fetch(`${COINGECKO_API_URL}/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,thb`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Failed to fetch prices: ${response.status}`);
  return response.json();
}

export function formatPrice(price: number, currency: 'usd' | 'thb'): string {
  return new Intl.NumberFormat(currency === 'usd' ? 'en-US' : 'th-TH', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatLastUpdated(date: Date): string {
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'medium' }).format(date);
}