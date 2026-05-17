import AddInventoryForm from "../components/form/AddInventoryForm";
import InventoryTable from "../components/InventoryTable";

export default function InventoryPage() {
  return (
    <div className="page-stack">
      <div className="page-title">
        <p>IMBENTARYO MANAGEMENT</p>
        <h2>Imbentaryo</h2>
        <span>Manage stock, presyo, category, at low-stock alerts.</span>
      </div>

      <AddInventoryForm />

      <InventoryTable />
    </div>
  );
}
