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
