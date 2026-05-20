import { Pencil, ReceiptText, Trash2, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
  useDeleteExpense,
  useExpenses,
  useUpdateExpense,
} from "../hooks/useExpenses";

import "../style/components/ExpensesTable.css";

type Category = "Supplies" | "Utilities" | "Rent" | "Delivery" | "Other";

export interface Expense {
  _id?: string;
  id?: string | number;
  category: Category;
  description: string;
  amount: number;
  date?: string;
  createdAt?: string;
}

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

const getExpenseId = (expense: Expense) => expense._id || expense.id;

const toInputDate = (date?: string) => {
  if (!date) return new Date().toISOString().slice(0, 10);

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return parsedDate.toISOString().slice(0, 10);
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDate = (date?: string) => {
  if (!date) return "No date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Invalid date";

  return parsedDate.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

function TableHead() {
  return (
    <tr>
      <th>Kategorya</th>
      <th>Description</th>
      <th>Petsa</th>
      <th style={{ textAlign: "right" }}>Amount</th>
      <th style={{ textAlign: "right" }}>Aksyon</th>
    </tr>
  );
}

function SkeletonRow() {
  return (
    <tr className="skel-row">
      <td>
        <div className="skel" style={{ width: 70 }} />
      </td>
      <td>
        <div className="skel" style={{ width: 160 }} />
      </td>
      <td>
        <div className="skel" style={{ width: 90 }} />
      </td>
      <td>
        <div className="skel" style={{ width: 70, marginLeft: "auto" }} />
      </td>
      <td>
        <div className="skel" style={{ width: 120, marginLeft: "auto" }} />
      </td>
    </tr>
  );
}

type EditExpenseModalProps = {
  expense: Expense | null;
  onClose: () => void;
};

function EditExpenseModal({ expense, onClose }: EditExpenseModalProps) {
  const updateExpense = useUpdateExpense();

  const [form, setForm] = useState<ExpenseFormData>({
    category: "Supplies",
    description: "",
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ExpenseFormData, string>>
  >({});

  useEffect(() => {
    if (!expense) return;

    setForm({
      category: expense.category,
      description: expense.description,
      amount: Number(expense.amount || 0),
      date: toInputDate(expense.date || expense.createdAt),
    });

    setErrors({});
  }, [expense]);

  if (!expense) return null;

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

    const id = getExpenseId(expense);

    if (!id) {
      console.error("Expense ID missing:", expense);
      return;
    }

    const nextErrors: Partial<Record<keyof ExpenseFormData, string>> = {};

    if (!form.description.trim()) {
      nextErrors.description = "Kailangan ng description.";
    }

    if (!form.amount || form.amount <= 0) {
      nextErrors.amount = "Dapat higit sa 0.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    updateExpense.mutate(
      {
        id: String(id),
        payload: {
          category: form.category,
          description: form.description.trim(),
          amount: Number(form.amount),
          date: form.date,
        },
      },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  return (
    <div
      className="modal-bg modal-bg--on"
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal modal--on edit-modal">
        <div className="modal__head modal__head--between">
          <div>
            <h2 className="modal__title">Edit Gastos</h2>
            <p className="modal__sub">
              I-update ang details ng selected expense.
            </p>
          </div>

          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close edit modal"
          >
            <X size={16} />
          </button>
        </div>

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
                  className={`chip${
                    form.category === category ? " chip--on" : ""
                  }`}
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
            />

            {errors.description && (
              <p className="ef__hint">{errors.description}</p>
            )}
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
                  onChange={(event) =>
                    set("amount", Number(event.target.value))
                  }
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
            disabled={updateExpense.isPending}
          >
            {updateExpense.isPending ? (
              <>
                <Loader2 size={16} className="spin" /> Updating...
              </>
            ) : (
              <>
                <Pencil size={16} /> Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ExpensesTable() {
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const { data, isLoading } = useExpenses();
  const deleteExpense = useDeleteExpense();

  const expenses: Expense[] = Array.isArray(data) ? data : [];

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0,
  );

  const count = expenses.length;

  const confirmDelete = () => {
    if (!expenseToDelete) return;

    const id = getExpenseId(expenseToDelete);

    if (!id) {
      console.error("Expense ID missing:", expenseToDelete);
      return;
    }

    deleteExpense.mutate(String(id), {
      onSuccess: () => setExpenseToDelete(null),
    });
  };

  return (
    <>
      <div className="et-card">
        <div className="et-toolbar">
          <div className="et-toolbar__left">
            <span className="et-toolbar__title">Listahan ng Gastos</span>

            {!isLoading && <span className="et-toolbar__count">{count}</span>}
          </div>

          {!isLoading && count > 0 && (
            <div className="et-toolbar__total">
              Kabuuan:{" "}
              <span className="et-toolbar__total-val">
                {formatAmount(total)}
              </span>
            </div>
          )}
        </div>

        <div className="et-scroll">
          {isLoading ? (
            <table className="et">
              <thead>
                <TableHead />
              </thead>

              <tbody>
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonRow key={`skeleton-${index}`} />
                ))}
              </tbody>
            </table>
          ) : count === 0 ? (
            <div className="et-empty">
              <div className="et-empty__icon">
                <ReceiptText size={24} />
              </div>

              <p className="et-empty__title">Walang gastos pa</p>

              <p className="et-empty__sub">
                Mag-click ng "Mag-log ng Gastos" para magsimula.
              </p>
            </div>
          ) : (
            <table className="et">
              <thead>
                <TableHead />
              </thead>

              <tbody>
                {expenses.map((expense, index) => {
                  const id = getExpenseId(expense);
                  const rowKey = id ? String(id) : `expense-${index}`;

                  return (
                    <tr key={rowKey}>
                      <td>
                        <span className={`badge badge--${expense.category}`}>
                          {expense.category}
                        </span>
                      </td>

                      <td>
                        <span className="et-desc" title={expense.description}>
                          {expense.description}
                        </span>
                      </td>

                      <td>
                        <span className="et-date">
                          {formatDate(expense.date || expense.createdAt)}
                        </span>
                      </td>

                      <td>
                        <span className="et-amount">
                          {formatAmount(expense.amount)}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="btn-edit"
                            onClick={() => setExpenseToEdit(expense)}
                            aria-label={`I-edit ang ${expense.description}`}
                          >
                            <Pencil size={13} />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn-del"
                            onClick={() => setExpenseToDelete(expense)}
                            aria-label={`I-delete ang ${expense.description}`}
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <EditExpenseModal
        expense={expenseToEdit}
        onClose={() => setExpenseToEdit(null)}
      />

      {expenseToDelete && (
        <div className="modal-bg modal-bg--on" role="dialog" aria-modal="true">
          <div className="modal modal--on delete-modal">
            <div className="modal__head">
              <div>
                <h2 className="modal__title">Delete Gastos?</h2>

                <p className="modal__sub">
                  Sigurado ka bang gusto mong tanggalin ang{" "}
                  <strong>{expenseToDelete.description}</strong>?
                </p>
              </div>
            </div>

            <div className="delete-modal__actions">
              <button
                type="button"
                className="delete-modal__cancel"
                onClick={() => setExpenseToDelete(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-modal__confirm"
                disabled={deleteExpense.isPending}
                onClick={confirmDelete}
              >
                {deleteExpense.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
