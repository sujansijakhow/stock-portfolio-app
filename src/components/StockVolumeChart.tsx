import { Column } from "@highcharts/react/series/index.js";
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Credits,
  PlotOptions,
} from "@highcharts/react";
import type { Stock } from "../types/stock";

interface Props {
  stock: Stock;
}

export const StockVolumeChart = ({ stock }: Props) => {
  const hasVolumeData = stock.history.some((point) => point.volume > 0);

  if (!hasVolumeData) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
        Volume data is unavailable for this stock.
      </div>
    );
  }

  return (
    <Column
      title={`${stock.ticker} Volume Traded`}
      height={300}
      colors={["#0ea5e9"]}
      backgroundColor="transparent"
    >
      <Credits enabled={false} />
      <PlotOptions
        series={{ animation: { duration: 800 } }}
        column={{ borderRadius: 4, borderWidth: 0 }}
      />
      <XAxis categories={stock.history.map((h) => h.date)} />
      <YAxis labels={{ format: "{value:,.0f}" }}>Volume</YAxis>
      <Tooltip valueDecimals={0} />
      <Legend enabled={false} />
      <Column.Series name="Volume" data={stock.history.map((h) => h.volume)} />
    </Column>
  );
};
