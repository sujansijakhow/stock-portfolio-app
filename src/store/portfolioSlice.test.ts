import { describe, it, expect } from 'vitest';
import portfolioReducer, { addStock, editStock, deleteStock, type PortfolioStock } from './portfolioSlice';

describe('portfolioSlice reducer', () => {
  const initialTestState = {
    holdings: [
      {
        id: 'stock-1',
        ticker: 'NVTX',
        companyName: 'NovaTech Dynamics',
        quantity: 1,
        purchasePrice: 150,
        currentPrice: 180,
      },
    ],
  };

  it('adds a new stock to holdings with generated id', () => {
    const newStock: Omit<PortfolioStock, 'id'> = {
      ticker: 'ZENT',
      companyName: 'Zenith Cloud Labs',
      quantity: 2,
      purchasePrice: 100,
      currentPrice: 120,
    };

    const nextState = portfolioReducer(initialTestState, addStock(newStock));
    expect(nextState.holdings).toHaveLength(2);
    expect(nextState.holdings[1].ticker).toBe('ZENT');
    expect(nextState.holdings[1].id).toBeDefined();
  });

  it('edits an existing stock by id', () => {
    const updatedStock: PortfolioStock = {
      id: 'stock-1',
      ticker: 'NVTX',
      companyName: 'NovaTech Dynamics',
      quantity: 5,
      purchasePrice: 155,
      currentPrice: 195,
    };

    const nextState = portfolioReducer(initialTestState, editStock(updatedStock));
    expect(nextState.holdings).toHaveLength(1);
    expect(nextState.holdings[0].quantity).toBe(5);
    expect(nextState.holdings[0].currentPrice).toBe(195);
  });

  it('deletes a stock by id', () => {
    const nextState = portfolioReducer(initialTestState, deleteStock('stock-1'));
    expect(nextState.holdings).toHaveLength(0);
  });
});
