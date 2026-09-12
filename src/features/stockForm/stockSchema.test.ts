import { describe, it, expect } from 'vitest';
import { stockSchema } from './stockSchema';

describe('stockSchema validation', () => {
  it('validates a valid stock entry correctly', async () => {
    const validData = {
      ticker: 'strx',
      companyName: 'Stratix Networks',
      quantity: 10,
      purchasePrice: 320.5,
      purchaseDate: '2026-01-15',
      currentPrice: 350.0,
      volume: 25000000,
    };

    const parsed = await stockSchema.validate(validData);
    expect(parsed.ticker).toBe('STRX');
    expect(parsed.quantity).toBe(10);
    expect(parsed.purchasePrice).toBe(320.5);
    expect(parsed.currentPrice).toBe(350.0);
  });

  it('allows optional/zero volume without error', async () => {
    const dataWithZeroVolume = {
      ticker: 'AURX',
      companyName: 'Aurora Dynamics',
      quantity: 5,
      purchasePrice: 120,
      purchaseDate: '2026-02-01',
      currentPrice: 130,
      volume: 0,
    };

    await expect(stockSchema.validate(dataWithZeroVolume)).resolves.toBeTruthy();

    const dataWithNoVolume = {
      ticker: 'AURX',
      companyName: 'Aurora Dynamics',
      quantity: 5,
      purchasePrice: 120,
      purchaseDate: '2026-02-01',
      currentPrice: 130,
    };

    await expect(stockSchema.validate(dataWithNoVolume)).resolves.toBeTruthy();
  });

  it('rejects invalid inputs like negative price or missing fields', async () => {
    const invalidData = {
      ticker: '',
      companyName: '',
      quantity: -5,
      purchasePrice: 0,
      purchaseDate: '',
      currentPrice: -10,
    };

    await expect(stockSchema.validate(invalidData)).rejects.toThrow();
  });
});
