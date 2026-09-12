import { Line } from '@highcharts/react/series/index.js';
import { XAxis, YAxis, Tooltip, Legend, Credits, PlotOptions } from '@highcharts/react';
import type { Stock } from '../types/stock';

interface Props {
  stock: Stock;
}

export const StockLineChart = ({ stock }: Props) => {
  return (
    <Line
      title={`${stock.ticker} Price Trend`}
      subtitle={stock.companyName}
      height={360}
      colors={['#2563eb']}
      backgroundColor="transparent"
    >
      <Credits enabled={false} />
      <PlotOptions
        series={{
          animation: { duration: 800 },
          marker: { enabled: true, radius: 4, symbol: 'circle' },
          lineWidth: 3,
        }}
      />
      <XAxis categories={stock.history.map((h) => h.date)} />
      <YAxis labels={{ format: '${value}' }}>Price (USD)</YAxis>
      <Tooltip valuePrefix="$" valueDecimals={2} />
      <Legend enabled={false} />
      <Line.Series name={stock.ticker} data={stock.history.map((h) => h.price)} />
    </Line>
  );
};