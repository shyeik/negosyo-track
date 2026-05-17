import { Loader2, PackagePlus } from "lucide-react";
import { useState } from "react";

import { useCreateInventoryItem } from "../../hooks/useInventory";

import "../../style/form/AddInventoryForm.css";

type InventoryForm = {
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockLevel: number;
};

const initialForm: InventoryForm = {
  name: "",
  category: "Paninda",
  price: 0,
  stock: 0,
  lowStockLevel: 5,
};

export default function AddInventoryForm() {
  const createInventoryItem = useCreateInventoryItem();

  const [form, setForm] = useState<InventoryForm>(initialForm);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...form,
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      lowStockLevel: Number(form.lowStockLevel),
    };

    if (!payload.name) {
      alert("Lagyan ng item name.");
      return;
    }

    if (payload.price < 0) {
      alert("Invalid price.");
      return;
    }

    if (payload.stock < 0) {
      alert("Invalid stock.");
      return;
    }

    createInventoryItem.mutate(payload, {
      onSuccess: () => {
        setForm(initialForm);
      },
    });
  };

  return (
    <section className="add-inventory-form">
      <div className="add-inventory-form__header">
        <div>
          <h3>Magdagdag ng Item</h3>

          <p>Add bagong paninda sa inventory.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="inventory-form-grid">
          <label>
            <span>Item Name</span>

            <input
              type="text"
              placeholder="Hal. Sardinas"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </label>

          <label>
            <span>Category</span>

            <select
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            >
              <option value="Paninda">Paninda</option>

              <option value="Drinks">Drinks</option>

              <option value="Snacks">Snacks</option>

              <option value="Essentials">Essentials</option>
            </select>
          </label>

          <label>
            <span>Presyo</span>

            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
            />
          </label>

          <label>
            <span>Stock</span>

            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  stock: Number(e.target.value),
                }))
              }
            />
          </label>

          <label>
            <span>Low Stock Alert</span>

            <input
              type="number"
              min="0"
              value={form.lowStockLevel}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  lowStockLevel: Number(e.target.value),
                }))
              }
            />
          </label>
        </div>

        <button
          type="submit"
          className="submit-inventory-btn"
          disabled={createInventoryItem.isPending}
        >
          {createInventoryItem.isPending ? (
            <>
              <Loader2 size={18} className="spin" />
              Saving...
            </>
          ) : (
            <>
              <PackagePlus size={18} />
              Save Item
            </>
          )}
        </button>
      </form>
    </section>
  );
}
