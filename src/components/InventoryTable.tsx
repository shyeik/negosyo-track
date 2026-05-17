import { Minus, Plus, Search, Trash2, AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";
import "../style/components/InventoryTable.css";

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockLevel: number;
};

const mockInventory: InventoryItem[] = [
  {
    id: 1,
    name: "Sardinas",
    category: "Paninda",
    price: 28,
    stock: 2,
    lowStockLevel: 5,
  },
  {
    id: 2,
    name: "Kape",
    category: "Drinks",
    price: 15,
    stock: 30,
    lowStockLevel: 10,
  },
  {
    id: 3,
    name: "Noodles",
    category: "Paninda",
    price: 18,
    stock: 8,
    lowStockLevel: 10,
  },
  {
    id: 4,
    name: "Softdrinks",
    category: "Drinks",
    price: 25,
    stock: 14,
    lowStockLevel: 8,
  },
];

const money = (value: number) => `₱${value.toLocaleString("en-PH")}`;

export default function InventoryTable() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<InventoryItem[]>(mockInventory);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search]);

  const updateStock = (id: number, amount: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, stock: Math.max(0, item.stock + amount) }
          : item,
      ),
    );
  };

  const deleteItem = (id: number) => {
    const confirmed = window.confirm("Tanggalin ang item na ito?");
    if (!confirmed) return;

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

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
                <tr key={item.id}>
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
                        onClick={() => updateStock(item.id, -1)}
                        disabled={item.stock <= 0}
                      >
                        <Minus size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => updateStock(item.id, 1)}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="inventory-delete-btn"
                      onClick={() => deleteItem(item.id)}
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
