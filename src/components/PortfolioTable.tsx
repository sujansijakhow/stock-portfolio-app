import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { useAppSelector } from "../hooks/reduxHooks";
import type { PortfolioStock } from "../store/portfolioSlice";
import { getGainLoss } from "../utils/portfolioCalculations";

const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, PortfolioStock>();

const columns = columnHelper.columns([
  columnHelper.accessor("ticker", { header: "Ticker" }),
  columnHelper.accessor("companyName", { header: "Company Name" }),
  columnHelper.accessor("quantity", { header: "Quantity" }),
  columnHelper.accessor("purchasePrice", {
    header: "Purchase Price",
    cell: (info) => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor("currentPrice", {
    header: "Current Price",
    cell: (info) => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.display({
    id: "gainLoss",
    header: "Gain / Loss",
    cell: (info) => {
      const { gainLoss, gainLossPercent } = getGainLoss(info.row.original);
      const color = gainLoss >= 0 ? "green" : "red";
      return (
        <span style={{ color }}>
          {gainLoss >= 0 ? "+" : ""}
          {gainLoss.toFixed(2)} ({gainLossPercent.toFixed(1)}%)
        </span>
      );
    },
  }),
]);

const EMPTY_HOLDINGS: PortfolioStock[] = [];

export const PortfolioTable = () => {
  const holdings =
    useAppSelector((state) => state.portfolio.holdings) ?? EMPTY_HOLDINGS;

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
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
                )}
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
