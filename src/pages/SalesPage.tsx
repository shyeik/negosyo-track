import { Loader2, Plus, Receipt, ReceiptText, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import SalesTable from "../components/SalesTable";
import { useCreateSale } from "../hooks/useSales";

type PaymentMethod = "Cash" | "GCash" | "Maya" | "Card";

type SaleFormData = {
  item: string;
  qty: number;
  price: number;
  paymentMethod: PaymentMethod;
  customerName: string;
  saleDate: string;
  status: "Completed" | "Pending" | "Cancelled";
};

const PAYMENT_METHODS: PaymentMethod[] = ["Cash", "GCash", "Maya", "Card"];

const today = () => new Date().toISOString().slice(0, 10);

const INITIAL_FORM: SaleFormData = {
  item: "",
  qty: 1,
  price: 0,
  paymentMethod: "Cash",
  customerName: "Walk-in",
  saleDate: today(),
  status: "Completed",
};

function SaleForm({ onSuccess }: { onSuccess: () => void }) {
  const createSale = useCreateSale();

  const [form, setForm] = useState<SaleFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SaleFormData, string>>
  >({});

  const amount = Number(form.qty || 0) * Number(form.price || 0);

  const set = <K extends keyof SaleFormData>(
    key: K,
    value: SaleFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof SaleFormData, string>> = {};

    if (!form.item.trim()) nextErrors.item = "Kailangan ng item.";
    if (form.qty <= 0) nextErrors.qty = "Dapat higit sa 0 ang quantity.";
    if (form.price <= 0) nextErrors.price = "Dapat higit sa 0 ang price.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    createSale.mutate(
      {
        item: form.item.trim(),
        qty: Number(form.qty),
        price: Number(form.price),
        amount,
        paymentMethod: form.paymentMethod,
        customerName: form.customerName.trim() || "Walk-in",
        saleDate: form.saleDate,
        status: form.status,
      },
      {
        onSuccess: () => {
          setForm(INITIAL_FORM);
          setErrors({});
          onSuccess();
        },
      },
    );
  };

  return (
    <form className="ef" onSubmit={handleSubmit} noValidate>
      <div>
        <label className="ef__label">
          Item <span className="ef__req">*</span>
        </label>
        <input
          type="text"
          placeholder="Hal. Coke, Bigas, LPG..."
          value={form.item}
          onChange={(event) => set("item", event.target.value)}
        />
        {errors.item && <p className="ef__hint">{errors.item}</p>}
      </div>

      <div className="ef__grid">
        <div>
          <label className="ef__label">
            Quantity <span className="ef__req">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={form.qty}
            onChange={(event) => set("qty", Number(event.target.value))}
          />
          {errors.qty && <p className="ef__hint">{errors.qty}</p>}
        </div>

        <div>
          <label className="ef__label">
            Price <span className="ef__req">*</span>
          </label>
          <div className="ef__amount">
            <span className="ef__peso">₱</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.price === 0 ? "" : form.price}
              onChange={(event) => set("price", Number(event.target.value))}
            />
          </div>
          {errors.price && <p className="ef__hint">{errors.price}</p>}
        </div>
      </div>

      <div>
        <span className="ef__label">Payment Method</span>
        <div className="ef__chips">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method}
              type="button"
              className={`chip${form.paymentMethod === method ? " chip--on" : ""}`}
              onClick={() => set("paymentMethod", method)}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      <div className="ef__grid">
        <div>
          <label className="ef__label">Customer</label>
          <input
            type="text"
            value={form.customerName}
            onChange={(event) => set("customerName", event.target.value)}
          />
        </div>

        <div>
          <label className="ef__label">Sale Date</label>
          <input
            type="date"
            value={form.saleDate}
            onChange={(event) => set("saleDate", event.target.value)}
          />
        </div>
      </div>

      <div className="ef__summary">
        Total Amount: <strong>₱{amount.toLocaleString("en-PH")}</strong>
      </div>

      <button
        type="submit"
        className="ef__submit"
        disabled={createSale.isPending}
      >
        {createSale.isPending ? (
          <>
            <Loader2 size={16} className="spin" /> Sine-save...
          </>
        ) : (
          <>
            <ReceiptText size={16} />
            Save Sale
          </>
        )}
      </button>
    </form>
  );
}

function AddSaleModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(frame);
    }

    setActive(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen && !active) return null;

  return (
    <div
      className={`modal-bg${active ? " modal-bg--on" : ""}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className={`modal${active ? " modal--on" : ""}`}>
        <div className="modal__head">
          <div>
            <div className="modal__icon">
              <Receipt size={20} />
            </div>
            <h2 className="modal__title">Add Sale</h2>
            <p className="modal__sub">Add a new sales transaction.</p>
          </div>

          <button className="modal__close" onClick={onClose} type="button">
            <X size={16} />
          </button>
        </div>

        <div className="modal__divider" />

        <div className="modal__body">
          <SaleForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}

export default function SalesPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const open = useCallback(() => setModalOpen(true), []);
  const close = useCallback(() => setModalOpen(false), []);

  return (
    <div className="ep">
      <header className="ep__header">
        <div>
          <p className="ep__eyebrow">Sales Management</p>
          <h1 className="ep__title">Sales</h1>
          <p className="ep__sub">
            Log, monitor, and manage all sales transactions.
          </p>
        </div>

        <button className="btn-add" onClick={open} type="button">
          <Plus size={16} /> Add Sale
        </button>
      </header>

      <SalesTable />

      <AddSaleModal isOpen={modalOpen} onClose={close} />
    </div>
  );
}
