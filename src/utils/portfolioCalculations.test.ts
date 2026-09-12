import { describe, it, expect } from 'vitest';
import { getGainLoss } from './portfolioCalculations';
import type { PortfolioStock } from '../store/portfolioSlice';

describe('portfolioCalculations', () => {
  it('calculates profit and percentage correctly', () => {
    const stock: PortfolioStock = {
      id: '1',
      ticker: 'NVTX',
      companyName: 'NovaTech Dynamics',
      quantity: 10,
      purchasePrice: 150,
      currentPrice: 180,
    };

    const result = getGainLoss(stock);
    expect(result.gainLoss).toBe(300);
    expect(result.gainLossPercent).toBe(20);
  });

  it('calculates loss and percentage correctly', () => {
    const stock: PortfolioStock = {
      id: '2',
      ticker: 'ZENT',
      companyName: 'Zenith Cloud Labs',
      quantity: 5,
      purchasePrice: 200,
      currentPrice: 160,
    };

    const result = getGainLoss(stock);
    expect(result.gainLoss).toBe(-200);
    expect(result.gainLossPercent).toBe(-20);
  });

  it('handles zero investment without dividing by zero', () => {
    const stock: PortfolioStock = {
      id: '3',
      ticker: 'FREE',
      companyName: 'Free Stock',
      quantity: 0,
      purchasePrice: 0,
      currentPrice: 50,
    };

    const result = getGainLoss(stock);
    expect(result.gainLoss).toBe(0);
    expect(result.gainLossPercent).toBe(0);
  });
});
