import { useState } from 'react';
import { useStocks } from '../hooks/useStocks';
import { StockLineChart } from '../components/StockLineChart';
import { StockVolumeChart } from '../components/StockVolumeChart';

export const ChartsPage = () => {
  const { data: stocks, isLoading, isError } = useStocks();
  const [selectedTicker, setSelectedTicker] = useState<string>('');

  if (isLoading) return <p>Loading charts...</p>;
  if (isError || !stocks) return <p>Failed to load stock data.</p>;

  const activeStock = stocks.find((s) => s.ticker === selectedTicker) ?? stocks[0];

  return (
    <div>
      <select value={activeStock.ticker} onChange={(e) => setSelectedTicker(e.target.value)}>
        {stocks.map((s) => (
          <option key={s.ticker} value={s.ticker}>
            {s.ticker} — {s.companyName}
          </option>
        ))}
      </select>

      <StockLineChart stock={activeStock} />
      <StockVolumeChart stock={activeStock} />
    </div>
  );
};