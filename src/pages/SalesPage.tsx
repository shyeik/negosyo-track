import AddSaleForm from "../components/form/AddSaleForm";
import SalesTable from "../components/SalesTable";

export default function SalesPage() {
  return (
    <div className="page-stack">
      <div className="page-title">
        <p>BENTA MANAGEMENT</p>
        <h2>Benta</h2>
        <span>Mag-log, mag-search, at mag-delete ng sales records.</span>
      </div>

      <AddSaleForm />

      <SalesTable />
    </div>
  );
}
