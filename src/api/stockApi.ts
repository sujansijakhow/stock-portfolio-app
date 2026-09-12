import type { Stock } from '../types/stock';
import mockStocks from './mockStock.json';

export const fetchStocks = (): Promise<Stock[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStocks as Stock[]);
    }, 400);
  });