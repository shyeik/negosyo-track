// pages/ExpensesPage.tsx
import { Plus, X, Receipt, ReceiptText, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import ExpensesTable from "../components/ExpensesTable";
import { useCreateExpense } from "../hooks/useExpenses";

import "../style/pages/ExpensesPage.css";

type Category = "Supplies" | "Utilities" | "Rent" | "Delivery" | "Other";

type ExpenseFormData = {
  category: Category;
  description: string;
  amount: number;
  date: string;
};

const CATEGORIES: Category[] = [
  "Supplies",
  "Utilities",
  "Rent",
  "Delivery",
  "Other",
];

const today = () => new Date().toISOString().slice(0, 10);

const INITIAL_FORM: ExpenseFormData = {
  category: "Supplies",
  description: "",
  amount: 0,
  date: today(),
};

interface ExpenseFormProps {
  onSuccess: () => void;
}

function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const createExpense = useCreateExpense();

  const [form, setForm] = useState<ExpenseFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ExpenseFormData, string>>
  >({});

  const set = <K extends keyof ExpenseFormData>(
    key: K,
    value: ExpenseFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof ExpenseFormData, string>> = {};

    if (!form.description.trim()) {
      nextErrors.description = "Kailangan ng description.";
    }

    if (!form.amount || form.amount <= 0) {
      nextErrors.amount = "Dapat higit sa 0.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    createExpense.mutate(
      {
        category: form.category,
        description: form.description.trim(),
        amount: Number(form.amount),
        date: form.date,
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
        <span className="ef__label">
          Kategorya <span className="ef__req">*</span>
        </span>

        <div className="ef__chips">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`chip${form.category === category ? " chip--on" : ""}`}
              onClick={() => set("category", category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="ef__label">
          Description <span className="ef__req">*</span>
        </label>

        <input
          type="text"
          placeholder="Hal. Electric bill, office supplies..."
          value={form.description}
          onChange={(event) => set("description", event.target.value)}
          autoComplete="off"
        />

        {errors.description && <p className="ef__hint">{errors.description}</p>}
      </div>

      <div className="ef__grid">
        <div>
          <label className="ef__label">
            Amount <span className="ef__req">*</span>
          </label>

          <div className="ef__amount">
            <span className="ef__peso">₱</span>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount === 0 ? "" : form.amount}
              onChange={(event) => set("amount", Number(event.target.value))}
            />
          </div>

          {errors.amount && <p className="ef__hint">{errors.amount}</p>}
        </div>

        <div>
          <label className="ef__label">Date</label>

          <input
            type="date"
            value={form.date}
            onChange={(event) => set("date", event.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        className="ef__submit"
        disabled={createExpense.isPending}
      >
        {createExpense.isPending ? (
          <>
            <Loader2 size={16} className="spin" /> Sine-save...
          </>
        ) : (
          <>
            <ReceiptText size={16} /> I-save ang Gastos
          </>
        )}
      </button>
    </form>
  );
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
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

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

            <h2 className="modal__title">Mag-log ng Gastos</h2>

            <p className="modal__sub">I-record ang bagong business expense.</p>
          </div>

          <button
            className="modal__close"
            onClick={onClose}
            type="button"
            aria-label="Isara"
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal__divider" />

        <div className="modal__body">
          <ExpenseForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}

export default function ExpensesPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const open = useCallback(() => setModalOpen(true), []);
  const close = useCallback(() => setModalOpen(false), []);

  return (
    <div className="ep">
      <header className="ep__header">
        <div>
          <p className="ep__eyebrow">Gastos Management</p>

          <h1 className="ep__title">Mga Gastos</h1>

          <p className="ep__sub">
            I-log, i-monitor, at i-manage ang lahat ng business expenses.
          </p>
        </div>

        <button className="btn-add" onClick={open} type="button">
          <Plus size={16} /> Mag-log ng Gastos
        </button>
      </header>

      <ExpensesTable />

      <AddExpenseModal isOpen={modalOpen} onClose={close} />
    </div>
  );
}
