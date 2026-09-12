import { createColumnHelper, tableFeatures, useTable } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { deleteStock, type PortfolioStock } from '../store/portfolioSlice';
import { getGainLoss } from '../utils/portfolioCalculations';


import { Pencil, Trash2 } from 'lucide-react';

const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, PortfolioStock>();

const EMPTY_HOLDINGS: PortfolioStock[] = [];

interface PortfolioTableProps {
  onEdit: (stock: PortfolioStock) => void;
}

export const PortfolioTable = ({ onEdit }: PortfolioTableProps) => {
  const dispatch = useAppDispatch();
  const holdings = useAppSelector((state) => state.portfolio.holdings) ?? EMPTY_HOLDINGS;

  const columns = columnHelper.columns([
    columnHelper.accessor('ticker', { header: 'Ticker' }),
    columnHelper.accessor('companyName', { header: 'Company Name' }),
    columnHelper.accessor('quantity', { header: 'Quantity' }),
    columnHelper.accessor('purchasePrice', {
      header: 'Purchase Price',
      cell: (info) => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor('currentPrice', {
      header: 'Current Price',
      cell: (info) => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.display({
      id: 'gainLoss',
      header: 'Gain / Loss',
      cell: (info) => {
        const { gainLoss, gainLossPercent } = getGainLoss(info.row.original);
        const color = gainLoss >= 0 ? 'green' : 'red';
        return (
          <span style={{ color }}>
            {gainLoss >= 0 ? '+' : ''}
            {gainLoss.toFixed(2)} ({gainLossPercent.toFixed(1)}%)
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(info.row.original)}
            className="text-blue-600 text-sm hover:underline cursor-pointer"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete ${info.row.original.ticker} from your portfolio?`)) {
                dispatch(deleteStock(info.row.original.id));
              }
            }}
            className="text-red-600 text-sm hover:underline cursor-pointer"
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
    data: holdings,
  });

  if (holdings.length === 0) {
    return <p>No stocks in your portfolio yet.</p>;
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead className="bg-slate-50">
        {table.getHeaderGroups().map((group) => (
          <tr key={group.id}>
            {group.headers.map((header) => (
              <th
                key={header.id}
                className="px-4 py-2 text-left font-semibold text-slate-600 uppercase text-xs tracking-wide border-b border-slate-200"
              >
                {header.isPlaceholder ? null : <table.FlexRender header={header} />}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="hover:bg-slate-50">
            {row.getAllCells().map((cell) => (
              <td key={cell.id} className="px-4 py-2 border-b border-slate-200">
                <table.FlexRender cell={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};