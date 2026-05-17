import { AlertTriangle, Minus, Plus, Search, Trash2 } from "lucide-react";

import { useMemo, useState } from "react";

import {
  useDeleteInventoryItem,
  useInventory,
  useUpdateInventoryStock,
} from "../hooks/useInventory";

import "../style/components/InventoryTable.css";

type InventoryItem = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockLevel: number;
};

const money = (value: number) => `₱${value.toLocaleString("en-PH")}`;

export default function InventoryTable() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useInventory();

  const updateStock = useUpdateInventoryStock();

  const deleteItem = useDeleteInventoryItem();

  const items: InventoryItem[] = Array.isArray(data) ? data : [];

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search]);

  const handleStockUpdate = (item: InventoryItem, amount: number) => {
    const updatedStock = Math.max(0, item.stock + amount);

    updateStock.mutate({
      id: item._id,
      stock: updatedStock,
    });
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Tanggalin ang item na ito?");

    if (!confirmed) return;

    deleteItem.mutate(id);
  };

  if (isLoading) {
    return (
      <section className="inventory-table">
        <div className="inventory-empty">Loading inventory...</div>
      </section>
    );
  }

  return (
    <section className="inventory-table">
      <div className="inventory-table__header">
        <div>
          <h3>Imbentaryo</h3>

          <p>Track stock, presyo, at low-stock alerts</p>
        </div>

        <div className="inventory-search">
          <Search size={16} />

          <input
            type="text"
            placeholder="Search item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="inventory-table__wrapper">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Presyo</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Controls</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => {
              const isLowStock = item.stock <= item.lowStockLevel;

              return (
                <tr key={item._id}>
                  <td>
                    <strong>{item.name}</strong>
                  </td>

                  <td>{item.category}</td>

                  <td>{money(item.price)}</td>

                  <td>
                    <b>{item.stock}</b>
                  </td>

                  <td>
                    <span
                      className={`stock-badge ${isLowStock ? "low" : "good"}`}
                    >
                      {isLowStock && <AlertTriangle size={13} />}

                      {isLowStock ? "Low Stock" : "Okay"}
                    </span>
                  </td>

                  <td>
                    <div className="stock-actions">
                      <button
                        type="button"
                        onClick={() => handleStockUpdate(item, -1)}
                        disabled={item.stock <= 0}
                      >
                        <Minus size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStockUpdate(item, 1)}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="inventory-delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <div className="inventory-empty">Walang item na nakita.</div>
        )}
      </div>
    </section>
  );
}
