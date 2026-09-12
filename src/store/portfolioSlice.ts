import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';
import mockStocks from '../api/mockStock.json';

export interface PortfolioStock {
    id: string;
    ticker: string;
    companyName: string;
    quantity: number;
    purchasePrice: number;
    purchaseDate?: string;
    currentPrice: number;
    volume?: number;
    volumeHistory?: Array<{
        date: string;
        volume: number;
    }>;
}

interface PortfolioState {
    holdings: PortfolioStock[];
}

const buildSeedHoldings = (): PortfolioStock[] =>
    mockStocks.slice(0, 2).map((stock, index) => ({
        id: `seed-${stock.ticker}-${index}`,
        ticker: stock.ticker,
        companyName: stock.companyName,
        quantity: 1,
        purchasePrice: stock.currentPrice,
        purchaseDate: new Date().toISOString().slice(0, 10),
        currentPrice: stock.currentPrice,
        volume: stock.history[stock.history.length - 1]?.volume ?? 0,
        volumeHistory: stock.history.map((entry) => ({
            date: entry.date,
            volume: entry.volume,
        })),
    }));

const initialState: PortfolioState = {
    holdings: buildSeedHoldings(),
};

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        addStock: {
            reducer: (state, action: PayloadAction<PortfolioStock>) => {
                state.holdings.push(action.payload);
            },
            prepare: (stock: Omit<PortfolioStock, 'id'>) => ({
                payload: { ...stock, id: nanoid() },
            }),
        },
        editStock: (state, action: PayloadAction<PortfolioStock>) => {
            const index = state.holdings.findIndex((s) => s.id === action.payload.id);
            if (index !== -1) state.holdings[index] = action.payload;
        },
        deleteStock: (state, action: PayloadAction<string>) => {
            state.holdings = state.holdings.filter((s) => s.id !== action.payload);
        },
    },
});

export const { addStock, editStock, deleteStock } = portfolioSlice.actions;
export default portfolioSlice.reducer;