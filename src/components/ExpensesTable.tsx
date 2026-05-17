import { Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { useDeleteExpense, useExpenses } from "../hooks/useExpenses";

import "../style/components/ExpensesTable.css";

type Expense = {
  _id: string;
  category: "Supplies" | "Utilities" | "Rent" | "Delivery" | "Other";

  description: string;
  amount: number;
  date: string;
};

const money = (value: number) => `₱${value.toLocaleString("en-PH")}`;

export default function ExpensesTable() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useExpenses();

  const deleteExpense = useDeleteExpense();

  const expenses: Expense[] = Array.isArray(data) ? data : [];

  const filteredExpenses = useMemo(() => {
    const query = search.toLowerCase();

    return expenses.filter(
      (expense) =>
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query),
    );
  }, [expenses, search]);

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Tanggalin ang gastos na ito?");

    if (!confirmed) return;

    deleteExpense.mutate(id);
  };

  if (isLoading) {
    return (
      <section className="expenses-table">
        <div className="expenses-empty">Loading expenses...</div>
      </section>
    );
  }

  return (
    <section className="expenses-table">
      <div className="expenses-table__header">
        <div>
          <h3>Gastos</h3>

          <p>Track supplies, bills, rent, delivery, at iba pang gastos</p>
        </div>

        <div className="expenses-search">
          <Search size={16} />

          <input
            type="text"
            placeholder="Search gastos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="expenses-table__wrapper">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Kategorya</th>
              <th>Amount</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense._id}>
                <td>
                  <strong>{expense.description}</strong>
                </td>

                <td>
                  <span
                    className={`expense-badge ${expense.category.toLowerCase()}`}
                  >
                    {expense.category}
                  </span>
                </td>

                <td>
                  <b>{money(expense.amount)}</b>
                </td>

                <td>
                  {new Date(expense.date).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </td>

                <td>
                  <button
                    type="button"
                    className="expense-delete-btn"
                    onClick={() => handleDelete(expense._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredExpenses.length === 0 && (
          <div className="expenses-empty">Walang gastos na nakita.</div>
        )}
      </div>
    </section>
  );
}
