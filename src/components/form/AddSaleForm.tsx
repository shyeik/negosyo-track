import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useCreateSale } from "../../hooks/useSales";
import "../../style/form/AddSaleForm.css";

type PaymentMethod = "Cash" | "GCash" | "Maya" | "Card";

type SaleForm = {
  item: string;
  qty: number;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
};

type FormErrors = Partial<Record<keyof SaleForm, string>>;

const PAYMENT_METHODS: PaymentMethod[] = ["Cash", "GCash", "Maya", "Card"];

const today = () => new Date().toISOString().slice(0, 10);

const initialForm: SaleForm = {
  item: "",
  qty: 1,
  amount: 0,
  paymentMethod: "Cash",
  date: today(),
};

function validate(form: SaleForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.item.trim()) errors.item = "Lagyan ng item.";
  if (form.qty <= 0) errors.qty = "Invalid quantity.";
  if (form.amount <= 0) errors.amount = "Invalid amount.";
  return errors;
}

export default function AddSaleForm() {
  const createSale = useCreateSale();
  const [form, setForm] = useState<SaleForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const set = <K extends keyof SaleForm>(key: K, value: SaleForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...form,
      item: form.item.trim(),
      qty: Number(form.qty),
      amount: Number(form.amount),
    };

    const validationErrors = validate(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    createSale.mutate(payload, {
      onSuccess: () => setForm(initialForm),
    });
  };

  return (
    <section className="add-sale-form">
      <div className="add-sale-form__header">
        <h3>Mag-log ng Benta</h3>
        <p>I-record ang bagong sale sa negosyo.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="field">
            <span>Item</span>
            <input
              type="text"
              placeholder="Hal. Kape"
              value={form.item}
              onChange={(e) => set("item", e.target.value)}
              aria-invalid={!!errors.item}
            />
            {errors.item && <span className="field__error">{errors.item}</span>}
          </label>

          <label className="field">
            <span>Qty</span>
            <input
              type="number"
              min="1"
              value={form.qty}
              onChange={(e) => set("qty", Number(e.target.value))}
              aria-invalid={!!errors.qty}
            />
            {errors.qty && <span className="field__error">{errors.qty}</span>}
          </label>

          <label className="field">
            <span>Amount (₱)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount || ""}
              onChange={(e) => set("amount", Number(e.target.value))}
              aria-invalid={!!errors.amount}
            />
            {errors.amount && (
              <span className="field__error">{errors.amount}</span>
            )}
          </label>

          <label className="field">
            <span>Payment</span>
            <select
              value={form.paymentMethod}
              onChange={(e) =>
                set("paymentMethod", e.target.value as PaymentMethod)
              }
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Date</span>
            <input
              type="date"
              value={form.date}
              max={today()}
              onChange={(e) => set("date", e.target.value)}
            />
          </label>
        </div>

        <button
          type="submit"
          className="submit-sale-btn"
          disabled={createSale.isPending}
        >
          {createSale.isPending ? (
            <>
              <Loader2 size={18} className="spin" /> Saving...
            </>
          ) : (
            <>
              <PlusCircle size={18} /> Save Sale
            </>
          )}
        </button>
      </form>
    </section>
  );
}
