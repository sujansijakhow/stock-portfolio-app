import { useState } from 'react';
import { useStocks } from '../hooks/useStocks';
import { StockLineChart } from '../components/StockLineChart';
import { StockVolumeChart } from '../components/StockVolumeChart';
import { useAppSelector } from '../hooks/reduxHooks';
import type { Stock } from '../types/stock';

const buildFallbackStock = (
  ticker: string,
  companyName: string,
  currentPrice: number,
  purchasePrice?: number,
  purchaseDate?: string,
  volume?: number,
  volumeHistory?: Array<{ date: string; volume: number }>,
): Stock => {
  const purchaseDateValue = purchaseDate ?? new Date().toISOString().slice(0, 10);
  const currentDateValue = new Date().toISOString().slice(0, 10);
  const fallbackVolume = volume ?? 0;

  const history = volumeHistory && volumeHistory.length > 0
    ? volumeHistory.map((entry, index) => ({
        date: entry.date,
        price: index === 0
          ? Number((purchasePrice ?? currentPrice).toFixed(2))
          : Number(currentPrice.toFixed(2)),
        volume: entry.volume,
      }))
    : [
        {
          date: purchaseDateValue,
          price: Number((purchasePrice ?? currentPrice).toFixed(2)),
          volume: fallbackVolume,
        },
        {
          date: currentDateValue,
          price: Number(currentPrice.toFixed(2)),
          volume: fallbackVolume,
        },
      ];

  return {
    ticker,
    companyName,
    currentPrice,
    history,
  };
};

export const ChartsPage = () => {
  const { data: stocks, isLoading, isError } = useStocks();
  const holdings = useAppSelector((state) => state.portfolio.holdings);
  const [selectedTicker, setSelectedTicker] = useState<string>('');

  if (isLoading) return <p className="text-sm text-slate-500">Loading charts...</p>;
  if (isError || !stocks) return <p className="text-sm text-red-500">Failed to load stock data.</p>;

  const visibleStocks =
    holdings.length > 0
      ? holdings.map((holding) => {
          const mockStock = stocks.find((stock) => stock.ticker === holding.ticker);

          if (!mockStock) {
            return buildFallbackStock(
              holding.ticker,
              holding.companyName,
              holding.currentPrice,
              holding.purchasePrice,
              holding.purchaseDate,
              holding.volume,
              holding.volumeHistory,
            );
          }

          return {
            ticker: holding.ticker,
            companyName: holding.companyName,
            currentPrice: holding.currentPrice,
            history: mockStock.history.map((point, index, array) =>
              index === array.length - 1
                ? { ...point, price: Number(holding.currentPrice.toFixed(2)) }
                : point,
            ),
          };
        })
      : stocks;

  const activeStock = visibleStocks.find((s) => s.ticker === selectedTicker) ?? visibleStocks[0];

  if (!activeStock) {
    return <p className="text-sm text-slate-500">No stock available.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">Market overview</p>
        <select
          value={activeStock.ticker}
          onChange={(e) => setSelectedTicker(e.target.value)}
          className="cursor-pointer rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          {visibleStocks.map((s) => (
            <option key={s.ticker} value={s.ticker}>
              {s.ticker} {s.companyName}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
          <StockLineChart stock={activeStock} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
          <StockVolumeChart stock={activeStock} />
        </div>
      </div>
    </div>
  );
};