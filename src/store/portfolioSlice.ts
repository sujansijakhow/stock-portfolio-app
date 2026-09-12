import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';

export interface PortfolioStock {
    id: string;
    ticker: string;
    companyName: string;
    quantity: number;
    purchasePrice: number;
    purchaseDate: string;
    currentPrice: number;
}

interface PortfolioState {
    holdings: PortfolioStock[];
}

const initialState: PortfolioState = {
    holdings: [],
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