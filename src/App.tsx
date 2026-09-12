import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { useStocks } from './hooks/useStocks';
import { ChartsPage } from './pages/ChartPages';
import { PortfolioTable } from './components/PortfolioTable';
import { addStock } from './store/portfolioSlice';

function App() {
  const { data, isLoading } = useStocks();
  console.log(data, isLoading);

  const dispatch = useAppDispatch();
  const holdings = useAppSelector((state) => state.portfolio.holdings);
  console.log(holdings);

  useEffect(() => {
    if (holdings.length === 0) {
      dispatch(
        addStock({
          ticker: 'AAPL',
          companyName: 'Apple Inc.',
          quantity: 10,
          purchasePrice: 180,
          purchaseDate: '2026-01-15',
          currentPrice: 227.5,
        }),
      );
      dispatch(
        addStock({
          ticker: 'TSLA',
          companyName: 'Tesla Inc.',
          quantity: 5,
          purchasePrice: 300,
          purchaseDate: '2026-02-01',
          currentPrice: 245.3,
        }),
      );
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <ChartsPage />
      <PortfolioTable />
    </div>
  );
}

export default App;