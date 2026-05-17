import { Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import "../style/components/ExpensesTable.css";

type Expense = {
  id: number;
  category: "Supplies" | "Utilities" | "Rent" | "Delivery" | "Other";
  description: string;
  amount: number;
  date: string;
};

const mockExpenses: Expense[] = [
  {
    id: 1,
    category: "Supplies",
    description: "Dagdag paninda",
    amount: 3200,
    date: "May 17, 2026",
  },
  {
    id: 2,
    category: "Utilities",
    description: "Electric bill",
    amount: 1450,
    date: "May 16, 2026",
  },
  {
    id: 3,
    category: "Delivery",
    description: "Delivery fee",
    amount: 250,
    date: "May 16, 2026",
  },
  {
    id: 4,
    category: "Rent",
    description: "Monthly stall rent",
    amount: 5000,
    date: "May 15, 2026",
  },
];

const money = (value: number) => `₱${value.toLocaleString("en-PH")}`;

export default function ExpensesTable() {
  const [search, setSearch] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  const filteredExpenses = useMemo(() => {
    const query = search.toLowerCase();

    return expenses.filter(
      (expense) =>
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query),
    );
  }, [expenses, search]);

  const deleteExpense = (id: number) => {
    const confirmed = window.confirm("Tanggalin ang gastos na ito?");
    if (!confirmed) return;

    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

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
              <tr key={expense.id}>
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

                <td>{expense.date}</td>

                <td>
                  <button
                    type="button"
                    className="expense-delete-btn"
                    onClick={() => deleteExpense(expense.id)}
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
