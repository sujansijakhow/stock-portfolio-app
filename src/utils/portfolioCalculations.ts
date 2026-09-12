import type { PortfolioStock } from '../store/portfolioSlice';

export const getGainLoss = (stock: PortfolioStock) => {
  const invested = stock.purchasePrice * stock.quantity;
  const currentValue = stock.currentPrice * stock.quantity;
  const gainLoss = currentValue - invested;
  const gainLossPercent = invested === 0 ? 0 : (gainLoss / invested) * 100;
  return { gainLoss, gainLossPercent };
};