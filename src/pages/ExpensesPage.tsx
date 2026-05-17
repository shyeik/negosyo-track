import AddExpenseForm from "../components/form/AddExpensesForm";
import ExpensesTable from "../components/ExpensesTable";

export default function ExpensesPage() {
  return (
    <div className="page-stack">
      <div className="page-title">
        <p>GASTOS MANAGEMENT</p>
        <h2>Gastos</h2>
        <span>Mag-log, mag-search, at mag-delete ng business expenses.</span>
      </div>

      <AddExpenseForm />

      <ExpensesTable />
    </div>
  );
}
