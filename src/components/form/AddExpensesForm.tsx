import { Loader2, ReceiptText } from "lucide-react";
import { useState } from "react";

import { useCreateExpense } from "../../hooks/useExpenses";

import "../../style/form/AddExpensesForm.css";

type ExpenseCategory = "Supplies" | "Utilities" | "Rent" | "Delivery" | "Other";

type ExpenseForm = {
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
};

const today = () => new Date().toISOString().slice(0, 10);

const initialForm: ExpenseForm = {
  category: "Supplies",
  description: "",
  amount: 0,
  date: today(),
};

export default function AddExpenseForm() {
  const createExpense = useCreateExpense();

  const [form, setForm] = useState<ExpenseForm>(initialForm);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...form,
      description: form.description.trim(),
      amount: Number(form.amount),
    };

    if (!payload.description) {
      alert("Lagyan ng description.");
      return;
    }

    if (payload.amount <= 0) {
      alert("Invalid amount.");
      return;
    }

    createExpense.mutate(payload, {
      onSuccess: () => {
        setForm(initialForm);
      },
    });
  };

  return (
    <section className="add-expense-form">
      <div className="add-expense-form__header">
        <div>
          <h3>Mag-log ng Gastos</h3>

          <p>I-record ang business expenses.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="expense-form-grid">
          <label>
            <span>Kategorya</span>

            <select
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  category: e.target.value as ExpenseCategory,
                }))
              }
            >
              <option value="Supplies">Supplies</option>

              <option value="Utilities">Utilities</option>

              <option value="Rent">Rent</option>

              <option value="Delivery">Delivery</option>

              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            <span>Description</span>

            <input
              type="text"
              placeholder="Hal. Electric bill"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </label>

          <label>
            <span>Amount</span>

            <input
              type="number"
              min="0"
              value={form.amount}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  amount: Number(e.target.value),
                }))
              }
            />
          </label>

          <label>
            <span>Date</span>

            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
            />
          </label>
        </div>

        <button
          type="submit"
          className="submit-expense-btn"
          disabled={createExpense.isPending}
        >
          {createExpense.isPending ? (
            <>
              <Loader2 size={18} className="spin" />
              Saving...
            </>
          ) : (
            <>
              <ReceiptText size={18} />
              Save Expense
            </>
          )}
        </button>
      </form>
    </section>
  );
}
