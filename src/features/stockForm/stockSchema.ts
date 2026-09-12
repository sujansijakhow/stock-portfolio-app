import * as yup from 'yup';

export const stockSchema = yup.object({
    ticker: yup.string().required('Ticker is required').uppercase(),
    companyName: yup.string().required('Company name is required'),
    quantity: yup.number().typeError('Quantity must be a number').positive().integer().required(),
    purchasePrice: yup.number().typeError('Purchase price must be a number').positive().required(),
    purchaseDate: yup.string().required('Purchase date is required'),
    currentPrice: yup.number().typeError('Current price must be a number').positive().required(),
});

export type StockFormValues = yup.InferType<typeof stockSchema>;