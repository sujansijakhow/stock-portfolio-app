import * as yup from 'yup';

const transformNumber = (_: unknown, originalValue: unknown) => {
    if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return undefined;
    }
    return typeof originalValue === 'number' ? originalValue : Number(originalValue);
};

export const stockSchema = yup.object({
    ticker: yup.string().required('Ticker is required').trim().uppercase(),
    companyName: yup.string().required('Company name is required').trim(),
    quantity: yup
        .number()
        .transform(transformNumber)
        .typeError('Quantity must be a number')
        .positive('Quantity must be greater than 0')
        .required('Quantity is required'),
    purchasePrice: yup
        .number()
        .transform(transformNumber)
        .typeError('Purchase price must be a number')
        .positive('Purchase price must be greater than 0')
        .required('Purchase price is required'),
    purchaseDate: yup.string().required('Purchase date is required'),
    currentPrice: yup
        .number()
        .transform(transformNumber)
        .typeError('Current price must be a number')
        .positive('Current price must be greater than 0')
        .required('Current price is required'),
    volume: yup
        .number()
        .transform(transformNumber)
        .typeError('Volume must be a number')
        .min(0, 'Volume cannot be negative')
        .optional()
        .nullable(),
});

export type StockFormValues = yup.InferType<typeof stockSchema>;