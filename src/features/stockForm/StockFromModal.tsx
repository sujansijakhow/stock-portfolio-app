import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { stockSchema, type StockFormValues } from "./stockSchema";
import { useAppDispatch } from "../../hooks/reduxHooks";
import {
  addStock,
  editStock,
  type PortfolioStock,
} from "../../store/portfolioSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingStock?: PortfolioStock | null;
}

export const StockFormModal = ({ isOpen, onClose, editingStock }: Props) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StockFormValues>({
    resolver: yupResolver(stockSchema),
  });

  useEffect(() => {
    if (editingStock) {
      reset(editingStock);
    } else {
      reset({
        ticker: "",
        companyName: "",
        quantity: undefined,
        purchasePrice: undefined,
        purchaseDate: "",
        currentPrice: undefined,
      });
    }
  }, [editingStock, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = (values: StockFormValues) => {
    if (editingStock) {
      dispatch(editStock({ ...values, id: editingStock.id }));
    } else {
      dispatch(addStock(values));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          {editingStock ? "Edit Stock" : "Add Stock"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <input
              {...register("ticker")}
              placeholder="Ticker (e.g. AAPL)"
              className="w-full border rounded px-3 py-2"
            />
            {errors.ticker && (
              <p className="text-red-500 text-xs mt-1">
                {errors.ticker.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("companyName")}
              placeholder="Company Name"
              className="w-full border rounded px-3 py-2"
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("quantity")}
              type="number"
              placeholder="Quantity"
              className="w-full border rounded px-3 py-2"
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("purchasePrice")}
              type="number"
              step="0.01"
              placeholder="Purchase Price"
              className="w-full border rounded px-3 py-2"
            />
            {errors.purchasePrice && (
              <p className="text-red-500 text-xs mt-1">
                {errors.purchasePrice.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("purchaseDate")}
              type="date"
              className="w-full border rounded px-3 py-2"
            />
            {errors.purchaseDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.purchaseDate.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("currentPrice")}
              type="number"
              step="0.01"
              placeholder="Current Price"
              className="w-full border rounded px-3 py-2"
            />
            {errors.currentPrice && (
              <p className="text-red-500 text-xs mt-1">
                {errors.currentPrice.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            >
              {editingStock ? "Save Changes" : "Add Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
