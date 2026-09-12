import { useState } from 'react';
import { ChartsPage } from './pages/ChartPages';
import { PortfolioTable } from './components/PortfolioTable';
// import { StockFormModal } from './features/stockForm/StockFormModal';
import { StockFormModal } from './features/stockForm/StockFromModal';
import type { PortfolioStock } from './store/portfolioSlice';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<PortfolioStock | null>(null);

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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Portfolio</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer"
        >
          Add Stock
        </button>
      </div>

      <ChartsPage />
      <PortfolioTable onEdit={handleEdit} />

      <StockFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingStock={editingStock}
      />
    </div>
  );
}

export default App;