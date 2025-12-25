'use client';

import { useState, useEffect, useCallback } from 'react';
import PriceCard from '@/components/PriceCard';
import { fetchCryptoPrices, formatLastUpdated } from '@/lib/coingecko';
import { CryptoCardData, CryptoPrices } from '@/types/crypto';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertCircle, Wifi } from 'lucide-react';

const CRYPTO_CONFIG: Omit<CryptoCardData, 'prices'>[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
];

const AUTO_REFRESH_INTERVAL = 60000;

export default function Dashboard() {
  const [prices, setPrices] = useState<CryptoPrices | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadPrices = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);
      const data = await fetchCryptoPrices();
      setPrices(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPrices();
    const interval = setInterval(() => loadPrices(true), AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadPrices]);

  const cryptoCards: CryptoCardData[] = prices
    ? CRYPTO_CONFIG.map((config) => ({ ...config, prices: prices[config.id as keyof CryptoPrices] }))
    : [];

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Crypto Dashboard</h1>
          <p className="text-muted-foreground">Real-time Bitcoin & Ethereum Prices</p>
        </header>
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <Badge variant={error ? 'destructive' : 'default'} className="gap-1.5">
                <Wifi className="h-3 w-3" />
                {error ? 'Offline' : 'Live'}
              </Badge>
              {lastUpdated && <span className="text-sm text-muted-foreground">อัปเดตล่าสุด: {formatLastUpdated(lastUpdated)}</span>}
            </div>
            <Button onClick={() => loadPrices(true)} disabled={isRefreshing} variant="default" size="lg">
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'กำลังโหลด...' : 'รีเฟรช'}
            </Button>
          </CardContent>
        </Card>
        {error && (
          <Card className="mb-8 border-destructive/50 bg-destructive/10">
            <CardContent className="flex items-center gap-3 py-4 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">{error}</p>
                <p className="text-sm opacity-80">กรุณาลองใหม่อีกครั้ง</p>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {isLoading && !prices ? (
            <>
              <PriceCard crypto={{ id: '', name: '', symbol: '', icon: '', prices: { usd: 0, thb: 0 } }} isLoading />
              <PriceCard crypto={{ id: '', name: '', symbol: '', icon: '', prices: { usd: 0, thb: 0 } }} isLoading />
            </>
          ) : (
            cryptoCards.map((crypto, index) => (
              <div key={crypto.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <PriceCard crypto={crypto} />
              </div>
            ))
          )}
        </div>
        <footer className="mt-12 text-center text-muted-foreground text-sm">
          <p>ข้อมูลจาก CoinGecko API • รีเฟรชอัตโนมัติทุก 60 วินาที</p>
        </footer>
      </div>
    </main>
  );
}