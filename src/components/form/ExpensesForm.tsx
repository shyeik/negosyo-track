// components/form/ExpenseForm.tsx
import { Loader2, ReceiptText } from "lucide-react";
import { useState } from "react";

import { useCreateExpense } from "../../hooks/useExpenses";
import "../../style/form/ExpenseForm.css";

// ─── Types ────────────────────────────────────────────────

type ExpenseCategory = "Supplies" | "Utilities" | "Rent" | "Delivery" | "Other";

type ExpenseForm = {
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
};

// ─── Constants ────────────────────────────────────────────

const CATEGORIES: ExpenseCategory[] = [
  "Supplies",
  "Utilities",
  "Rent",
  "Delivery",
  "Other",
];

const today = () => new Date().toISOString().slice(0, 10);

const initialForm: ExpenseForm = {
  category: "Supplies",
  description: "",
  amount: 0,
  date: today(),
};

// ─── Props ────────────────────────────────────────────────

interface ExpenseFormProps {
  onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────

export default function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const createExpense = useCreateExpense();
  const [form, setForm] = useState<ExpenseForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseForm, string>>>({});

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.description.trim()) next.description = "Kailangan ng description.";
    if (form.amount <= 0) next.amount = "Dapat higit sa 0 ang amount.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      description: form.description.trim(),
      amount: Number(form.amount),
    };

    createExpense.mutate(payload, {
      onSuccess: () => {
        setForm(initialForm);
        setErrors({});
        onSuccess?.();
      },
    });
  };

  const setField = <K extends keyof ExpenseForm>(key: K, value: ExpenseForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      {/* Category */}
      <div className="expense-field">
        <label className="expense-field__label">
          Kategorya <span className="expense-field__required">*</span>
        </label>
        <div className="expense-field__chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`expense-chip${form.category === cat ? " expense-chip--active" : ""}`}
              onClick={() => setField("category", cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="expense-field">
        <label className="expense-field__label">
          Description <span className="expense-field__required">*</span>
        </label>
        <input
          type="text"
          placeholder="Hal. Electric bill, office supplies…"
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          autoComplete="off"
        />
        {errors.description && (
          <span className="expense-field__hint">{errors.description}</span>
        )}
      </div>

      {/* Amount + Date in grid */}
      <div className="expense-form__grid">
        {/* Amount */}
        <div className="expense-field">
          <label className="expense-field__label">
            Amount <span className="expense-field__required">*</span>
          </label>
          <div className="expense-field__amount-wrapper">
            <span className="expense-field__amount-prefix">₱</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount === 0 ? "" : form.amount}
              placeholder="0.00"
              onChange={(e) => setField("amount", Number(e.target.value))}
            />
          </div>
          {errors.amount && (
            <span className="expense-field__hint">{errors.amount}</span>
          )}
        </div>

        {/* Date */}
        <div className="expense-field">
          <label className="expense-field__label">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setField("date", e.target.value)}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="expense-form__submit"
        disabled={createExpense.isPending}
      >
        {createExpense.isPending ? (
          <>
            <Loader2 size={16} className="spin" />
            Sine-save…
          </>
        ) : (
          <>
            <ReceiptText size={16} />
            I-save ang Gastos
          </>
        )}
      </button> 
    </form>
  );
}