import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { stockSchema, type StockFormValues } from "./stockSchema";
import { useAppDispatch } from "../../hooks/reduxHooks";
import {
  addStock,
  editStock,
  type PortfolioStock,
} from "../../store/portfolioSlice";
import { emitToast } from "../../utils/toast";

interface VolumeHistoryEntry {
  date: string;
  volume: number | "";
}

const today = new Date().toISOString().slice(0, 10);

const buildVolumeHistoryEntries = (editingStock?: PortfolioStock | null): VolumeHistoryEntry[] => {
  if (editingStock?.volumeHistory && editingStock.volumeHistory.length > 0) {
    return editingStock.volumeHistory.map((entry) => ({
      date: entry.date,
      volume: entry.volume,
    }));
  }

  const purchaseDate = editingStock?.purchaseDate ?? today;

  if (editingStock) {
    return [
      { date: purchaseDate, volume: editingStock.volume ?? 0 },
      { date: today, volume: editingStock.volume ?? 0 },
    ];
  }

  return [{ date: today, volume: 0 }];
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingStock?: PortfolioStock | null;
}

export const StockFormModal = ({ isOpen, onClose, editingStock }: Props) => {
  const dispatch = useAppDispatch();
  const [volumeHistoryEntries, setVolumeHistoryEntries] = useState<VolumeHistoryEntry[]>(
    buildVolumeHistoryEntries(editingStock),
  );

  const updateVolumeEntry = (index: number, value: string) => {
    const nextEntries = [...volumeHistoryEntries];
    nextEntries[index] = {
      ...nextEntries[index],
      volume: value === "" ? "" : Number(value),
    };
    setVolumeHistoryEntries(nextEntries);
  };
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
      reset({
        ticker: editingStock.ticker,
        companyName: editingStock.companyName,
        quantity: editingStock.quantity,
        purchasePrice: editingStock.purchasePrice,
        purchaseDate: editingStock.purchaseDate ?? "",
        currentPrice: editingStock.currentPrice,
        volume: editingStock.volume ?? 0,
      });
      setVolumeHistoryEntries(buildVolumeHistoryEntries(editingStock));
    } else {
      reset({
        ticker: "",
        companyName: "",
        quantity: undefined,
        purchasePrice: undefined,
        purchaseDate: today,
        currentPrice: undefined,
        volume: undefined,
      });
      setVolumeHistoryEntries([
        { date: today, volume: 0 },
      ]);
    }
  }, [editingStock, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = (values: StockFormValues) => {
    const normalizedValues = {
      ticker: values.ticker.trim().toUpperCase(),
      companyName: values.companyName.trim(),
      quantity: Number(values.quantity),
      purchasePrice: Number(values.purchasePrice),
      currentPrice: Number(values.currentPrice),
      purchaseDate: values.purchaseDate || today,
      volume: values.volume !== undefined && values.volume !== null ? Number(values.volume) : undefined,
    };

    const volumeHistory = volumeHistoryEntries
      .filter((entry) => entry.date && entry.date.trim() !== "")
      .map((entry) => ({
        date: entry.date,
        volume: typeof entry.volume === "number" ? entry.volume : Number(entry.volume) || 0,
      }));

    const nextVolume = volumeHistory.length > 0
      ? volumeHistory[volumeHistory.length - 1].volume
      : (normalizedValues.volume ?? 0);

    if (editingStock) {
      dispatch(
        editStock({
          id: editingStock.id,
          ...normalizedValues,
          volume: nextVolume,
          volumeHistory,
        }),
      );
      emitToast(`${normalizedValues.ticker} updated successfully.`, 'success');
    } else {
      dispatch(
        addStock({
          ...normalizedValues,
          volume: nextVolume,
          volumeHistory,
        }),
      );
      emitToast(`${normalizedValues.ticker} added successfully.`, 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold mb-5 text-slate-800">
          {editingStock ? "Edit Stock" : "Add Stock"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Ticker</label>
              <input
                {...register("ticker")}
                placeholder="Ticker (e.g. NVTX)"
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.ticker && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.ticker.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Company Name</label>
              <input
                {...register("companyName")}
                placeholder="Company Name"
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Quantity</label>
              <input
                {...register("quantity")}
                type="number"
                placeholder="Quantity"
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Purchase Price</label>
              <input
                {...register("purchasePrice")}
                type="number"
                step="0.01"
                placeholder="Purchase Price"
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
              />
              {errors.purchasePrice && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.purchasePrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Purchase Date</label>
              <input
                {...register("purchaseDate")}
                type="date"
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
              />
              {errors.purchaseDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.purchaseDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Current Price</label>
              <input
                {...register("currentPrice")}
                type="number"
                step="0.01"
                placeholder="Current Price"
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.currentPrice && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.currentPrice.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="block text-sm font-medium text-slate-700">Volume History</label>
                <button
                  type="button"
                  onClick={() =>
                    setVolumeHistoryEntries((current) => [
                      ...current,
                      { date: today, volume: "" },
                    ])
                  }
                  className="cursor-pointer rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  + Add entry
                </button>
              </div>

              <div className="space-y-2">
                {volumeHistoryEntries.map((entry, index) => (
                  <div key={`${entry.date}-${index}`} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_auto]">
                    <input
                      type="date"
                      value={entry.date}
                      onChange={(event) => {
                        const nextEntries = [...volumeHistoryEntries];
                        nextEntries[index] = {
                          ...nextEntries[index],
                          date: event.target.value,
                        };
                        setVolumeHistoryEntries(nextEntries);
                      }}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />

                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={entry.volume}
                      onChange={(event) => updateVolumeEntry(index, event.target.value)}
                      placeholder="Volume"
                      className="w-full border border-slate-300 rounded-xl px-3 py-2.5 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />

                    {volumeHistoryEntries.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setVolumeHistoryEntries((current) => current.filter((_, itemIndex) => itemIndex !== index))
                        }
                        className="cursor-pointer rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {editingStock ? "Save Changes" : "Add Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
