import { useMemo, useState } from 'react';
import { ChartsPage } from '../pages/ChartPages';
import { PortfolioTable } from './PortfolioTable';
import { StockLineChart } from './StockLineChart';
import { StockVolumeChart } from './StockVolumeChart';
import { StockFormModal } from '../features/stockForm/StockFromModal';
import { useAppSelector } from '../hooks/reduxHooks';
import { useStocks } from '../hooks/useStocks';
import type { PortfolioStock } from '../store/portfolioSlice';
import { getGainLoss } from '../utils/portfolioCalculations';

type View = 'dashboard' | 'portfolio' | 'detail';

export const PortfolioDashboard = () => {
  const holdings = useAppSelector((state) => state.portfolio.holdings);
  const { data: stocks = [] } = useStocks();

  const [view, setView] = useState<View>('dashboard');
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<PortfolioStock | null>(null);

  const portfolioSummary = useMemo(() => {
    const totalInvested = holdings.reduce(
      (sum, stock) => sum + stock.purchasePrice * stock.quantity,
      0,
    );

    const portfolioValue = holdings.reduce(
      (sum, stock) => sum + stock.currentPrice * stock.quantity,
      0,
    );

    const totalGainLoss = holdings.reduce((sum, stock) => sum + getGainLoss(stock).gainLoss, 0);
    const totalGainLossPercent = totalInvested === 0 ? 0 : (totalGainLoss / totalInvested) * 100;

    const topHoldings = holdings
      .map((stock) => {
        const currentValue = stock.currentPrice * stock.quantity;

        return {
          ...stock,
          currentPrice: stock.currentPrice,
          currentValue,
        };
      })
      .sort((a, b) => b.currentValue - a.currentValue)
      .slice(0, 4);

    return {
      totalInvested,
      portfolioValue,
      totalGainLoss,
      totalGainLossPercent,
      topHoldings,
      holdingsCount: holdings.length,
    };
  }, [holdings]);

  const selectedPortfolioStock =
    holdings.find((stock) => stock.id === selectedStockId) ??
    holdings.find((stock) => stock.ticker === selectedStockId) ??
    null;

  const selectedStockData = useMemo(() => {
    if (!selectedPortfolioStock) {
      return null;
    }

    const mockStock = stocks.find((stock) => stock.ticker === selectedPortfolioStock.ticker);

    const history = mockStock?.history
      ? mockStock.history.map((point, index, array) =>
          index === array.length - 1
            ? { ...point, price: Number(selectedPortfolioStock.currentPrice.toFixed(2)) }
            : point,
        )
      : (selectedPortfolioStock.volumeHistory && selectedPortfolioStock.volumeHistory.length > 0
          ? selectedPortfolioStock.volumeHistory.map((entry, index) => ({
              date: entry.date,
              price: index === 0
                ? Number((selectedPortfolioStock.purchasePrice ?? selectedPortfolioStock.currentPrice).toFixed(2))
                : Number(selectedPortfolioStock.currentPrice.toFixed(2)),
              volume: entry.volume,
            }))
          : (() => {
              const purchaseDateValue = selectedPortfolioStock.purchaseDate ?? new Date().toISOString().slice(0, 10);
              const currentDateValue = new Date().toISOString().slice(0, 10);

              return [
                {
                  date: purchaseDateValue,
                  price: Number((selectedPortfolioStock.purchasePrice ?? selectedPortfolioStock.currentPrice).toFixed(2)),
                  volume: selectedPortfolioStock.volume ?? 0,
                },
                {
                  date: currentDateValue,
                  price: Number(selectedPortfolioStock.currentPrice.toFixed(2)),
                  volume: selectedPortfolioStock.volume ?? 0,
                },
              ];
            })());

    return {
      ticker: selectedPortfolioStock.ticker,
      companyName: selectedPortfolioStock.companyName,
      currentPrice: selectedPortfolioStock.currentPrice,
      history,
    };
  }, [selectedPortfolioStock, stocks]);

  const handleAddNew = () => {
    setEditingStock(null);
    setIsModalOpen(true);
  };

  const handleEdit = (stock: PortfolioStock) => {
    setEditingStock(stock);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStock(null);
  };

  const openDetail = (stock: PortfolioStock) => {
    setSelectedStockId(stock.id);
    setView('detail');
  };

  const renderDashboard = () => (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Good morning, Sujan 👋</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">Portfolio Dashboard</h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setView('portfolio')}
              className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
            >
              View Portfolio
            </button>
            <button
              onClick={handleAddNew}
              className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              + Add Stock
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm text-slate-500">Portfolio Value</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">
            ${portfolioSummary.portfolioValue.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm text-slate-500">Total Invested</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">
            ${portfolioSummary.totalInvested.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm text-slate-500">Profit / Loss</p>
          <p className={`mt-2 text-2xl font-bold ${portfolioSummary.totalGainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ${portfolioSummary.totalGainLoss.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {portfolioSummary.totalGainLossPercent >= 0 ? '+' : ''}
            {portfolioSummary.totalGainLossPercent.toFixed(1)}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm text-slate-500">Holdings</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">
            {portfolioSummary.holdingsCount} Stocks
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <ChartsPage />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Top Holdings</h2>
          <button
            onClick={() => setView('portfolio')}
            className="cursor-pointer text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            View Portfolio →
          </button>
        </div>

        <div className="space-y-3">
          {portfolioSummary.topHoldings.map((stock) => (
            <button
              key={stock.id}
              onClick={() => openDetail(stock)}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div>
                <p className="font-semibold text-slate-800">{stock.ticker}</p>
                <p className="text-sm text-slate-600">{stock.companyName}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">${stock.currentValue.toFixed(2)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="mx-auto max-w-7xl space-y-5 p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <button
          onClick={() => setView('dashboard')}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-900"
        >
          ← Back
        </button>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Track and manage your investments</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">My Portfolio</h1>
          </div>

          <button
            onClick={handleAddNew}
            className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Add Stock
          </button>
        </div>
      </div>

      <PortfolioTable onEdit={handleEdit} onView={openDetail} />
    </div>
  );

  const renderDetail = () => {
    if (!selectedPortfolioStock || !selectedStockData) {
      return (
        <div className="mx-auto max-w-5xl space-y-4 p-4 md:p-6">
          <button
            onClick={() => setView('portfolio')}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-900"
          >
            ← Back
          </button>
          <div className="pt-2">
            <p className="text-slate-600">Stock details are unavailable.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <button
            onClick={() => setView('portfolio')}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-900"
          >
            ← Back
          </button>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">{selectedStockData.companyName}</p>
              <h1 className="text-3xl font-bold text-slate-800">{selectedPortfolioStock.ticker}</h1>
            </div>

            <button
              onClick={() => {
                setEditingStock(selectedPortfolioStock);
                setIsModalOpen(true);
              }}
              className="cursor-pointer rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900"
            >
              Edit Stock
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Current Price</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ${selectedStockData.currentPrice.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Current Value</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              ${(
                selectedStockData.currentPrice * selectedPortfolioStock.quantity
              ).toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Shares</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              {selectedPortfolioStock.quantity}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Profit / Loss</p>
            <p className={`mt-2 text-2xl font-bold ${getGainLoss(selectedPortfolioStock).gainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              ${getGainLoss(selectedPortfolioStock).gainLoss.toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {getGainLoss(selectedPortfolioStock).gainLossPercent >= 0 ? '+' : ''}
              {getGainLoss(selectedPortfolioStock).gainLossPercent.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <StockLineChart stock={selectedStockData} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <StockVolumeChart stock={selectedStockData} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      {view === 'dashboard' && renderDashboard()}
      {view === 'portfolio' && renderPortfolio()}
      {view === 'detail' && renderDetail()}

      <StockFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingStock={editingStock}
      />
    </div>
  );
};
