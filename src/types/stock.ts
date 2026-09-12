export interface StockHistoryPoint {
  date: string;
  price: number;
  volume: number;
}

export interface Stock {
  ticker: string;
  companyName: string;
  currentPrice: number;
  history: StockHistoryPoint[];
}