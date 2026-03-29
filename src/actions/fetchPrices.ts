"use server"

interface PriceResult {
  label: string;
  value: string;
  change: string;
  direction: 'up' | 'down';
}

export async function fetchOilPrices(): Promise<PriceResult[]> {
  const symbols = [
    { symbol: 'CL=F', label: 'WTI CRUDE' },
    { symbol: 'BZ=F', label: 'BRENT CRUDE' },
    { symbol: 'NG=F', label: 'NAT GAS' },
    { symbol: 'RB=F', label: 'RBOB GAS' },
    { symbol: 'HO=F', label: 'HEATING OIL' },
  ];

  const results: PriceResult[] = [];

  for (const { symbol, label } of symbols) {
    try {
      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`,
        { 
          cache: 'no-store',
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        }
      );

      if (res.ok) {
        const json = await res.json();
        const meta = json.chart?.result?.[0]?.meta;
        if (meta) {
          const price = meta.regularMarketPrice;
          const prevClose = meta.chartPreviousClose || meta.previousClose;
          const diff = price - prevClose;
          results.push({
            label,
            value: price.toFixed(2),
            change: (diff >= 0 ? '+' : '') + diff.toFixed(2),
            direction: diff >= 0 ? 'up' : 'down'
          });
        }
      }
    } catch (err) {
      console.error(`Failed to fetch ${symbol}:`, err);
    }
  }

  return results;
}
