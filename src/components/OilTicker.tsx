"use client";

import { useState, useEffect } from 'react';
import { fetchOilPrices } from '@/actions/fetchPrices';

interface PriceData {
  label: string;
  value: string;
  change: string;
  direction: 'up' | 'down';
}

export default function OilTicker() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    async function loadPrices() {
      try {
        const liveData = await fetchOilPrices();

        if (liveData.length > 0) {
          setPrices(liveData);
        } else {
          // Fallback if Yahoo is completely down
          setPrices([
            { label: 'WTI CRUDE', value: '---', change: '--', direction: 'up' },
            { label: 'BRENT CRUDE', value: '---', change: '--', direction: 'up' },
            { label: 'NAT GAS', value: '---', change: '--', direction: 'up' },
          ]);
        }

        const now = new Date();
        setLastUpdate(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      } catch {
        // Silent fail
      }
    }

    loadPrices();
    const interval = setInterval(loadPrices, 120000);
    return () => clearInterval(interval);
  }, []);

  if (prices.length === 0) return null;

  return (
    <div className="price-ticker">
      {prices.map((p, i) => (
        <div key={i} className="ticker-item">
          <span className="ticker-label">{p.label}</span>
          <span className="ticker-value">${p.value}</span>
          <span className={`ticker-change ${p.direction}`}>
            {p.direction === 'up' ? '▲' : '▼'} {p.change}
          </span>
        </div>
      ))}
      {lastUpdate && (
        <span style={{ color: '#3f3f46', fontSize: '0.55rem', position: 'absolute', right: '16px' }}>
          {lastUpdate}
        </span>
      )}
    </div>
  );
}
