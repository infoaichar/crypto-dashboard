'use client';

import { CryptoCardData } from '@/types/crypto';
import { formatPrice } from '@/lib/coingecko';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface PriceCardProps {
  crypto: CryptoCardData;
  isLoading?: boolean;
}

export default function PriceCard({ crypto, isLoading }: PriceCardProps) {
  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:bg-card hover:border-border hover:shadow-lg group">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
            {crypto.icon}
          </div>
          <div>
            <CardTitle className="text-xl">{crypto.name}</CardTitle>
            <CardDescription>
              <Badge variant="secondary" className="text-xs font-mono">{crypto.symbol}</Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇺🇸</span>
            <span className="text-sm font-medium text-emerald-400">USD</span>
          </div>
          <span className="text-xl font-bold text-foreground tabular-nums">{formatPrice(crypto.prices.usd, 'usd')}</span>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇹🇭</span>
            <span className="text-sm font-medium text-blue-400">THB</span>
          </div>
          <span className="text-xl font-bold text-foreground tabular-nums">{formatPrice(crypto.prices.thb, 'thb')}</span>
        </div>
      </CardContent>
    </Card>
  );
}