import { useState } from 'react';
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { deleteStock, type PortfolioStock } from '../store/portfolioSlice';
import { emitToast } from '../utils/toast';

import { ArrowUpDown, BarChart3, Pencil, Search, Trash2 } from 'lucide-react';

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});
const columnHelper = createColumnHelper<typeof features, PortfolioStock>();

const EMPTY_HOLDINGS: PortfolioStock[] = [];

interface PortfolioTableProps {
  onEdit: (stock: PortfolioStock) => void;
  onView?: (stock: PortfolioStock) => void;
}

export const PortfolioTable = ({ onEdit, onView }: PortfolioTableProps) => {
  const dispatch = useAppDispatch();
  const holdings = useAppSelector((state) => state.portfolio.holdings) ?? EMPTY_HOLDINGS;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHoldings = holdings.filter(
    (stock) =>
      stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.companyName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = columnHelper.columns([
    columnHelper.accessor('ticker', { header: 'Ticker' }),
    columnHelper.accessor('companyName', { header: 'Company Name' }),
    columnHelper.accessor('quantity', { header: 'Quantity' }),
    columnHelper.accessor('purchasePrice', {
      header: 'Purchase Price',
      cell: (info) => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor('purchaseDate', {
      header: 'Purchase Date',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('currentPrice', {
      header: 'Current Price',
      cell: (info) => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center gap-2">
          {onView && (
            <button
              onClick={() => onView(info.row.original)}
              className="cursor-pointer rounded-lg border border-slate-300 bg-white p-1.5 text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
              title="View details"
            >
              <BarChart3 size={16} />
            </button>
          )}
          <button
            onClick={() => onEdit(info.row.original)}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white p-1.5 text-blue-600 transition hover:border-blue-300 hover:bg-blue-50"
            title="Edit stock"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete ${info.row.original.ticker} from your portfolio?`)) {
                dispatch(deleteStock(info.row.original.id));
                emitToast(`${info.row.original.ticker} deleted from portfolio.`, 'success');
              }
            }}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white p-1.5 text-red-600 transition hover:border-red-300 hover:bg-red-50"
            title="Delete stock"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    }),
  ]);

  const table = useTable({
    features,
    columns,
    data: filteredHoldings,
  });

  if (holdings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <p className="text-lg font-semibold text-slate-700">No stocks in your portfolio yet.</p>
        <p className="mt-1 text-sm text-slate-500">Add your first holding to start tracking performance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full max-w-xl">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={18} />
          </span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ticker or company..."
            className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      {filteredHoldings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-base font-semibold text-slate-700">No stocks match your search.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-slate-100">
                {table.getHeaderGroups().map((group) => (
                  <tr key={group.id}>
                    {group.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer select-none border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600"
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center gap-1">
                            <table.FlexRender header={header} />
                            <ArrowUpDown size={12} className="text-slate-400" />
                            {header.column.getIsSorted() === 'asc' && '↑'}
                            {header.column.getIsSorted() === 'desc' && '↓'}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="transition hover:bg-slate-50">
                    {row.getAllCells().map((cell) => (
                      <td key={cell.id} className="border-b border-slate-200 px-4 py-3 align-middle text-slate-700">
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};