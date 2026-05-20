// pages/InventoryPage.tsx
import { Box, Loader2, PackagePlus, Plus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import InventoryTable from "../components/InventoryTable";
import { useCreateInventoryItem } from "../hooks/useInventory";

type InventoryFormData = {
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockLevel: number;
};

const INITIAL_FORM: InventoryFormData = {
  name: "",
  category: "",
  price: 0,
  stock: 0,
  lowStockLevel: 5,
};

interface InventoryFormProps {
  onSuccess: () => void;
}

function InventoryForm({ onSuccess }: InventoryFormProps) {
  const createInventory = useCreateInventoryItem();

  const [form, setForm] = useState<InventoryFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof InventoryFormData, string>>
  >({});

  const set = <K extends keyof InventoryFormData>(
    key: K,
    value: InventoryFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof InventoryFormData, string>> = {};

    if (!form.name.trim()) nextErrors.name = "Kailangan ng item name.";
    if (!form.category.trim()) nextErrors.category = "Kailangan ng category.";
    if (form.price <= 0) nextErrors.price = "Dapat higit sa 0 ang price.";
    if (form.stock < 0) nextErrors.stock = "Hindi puwedeng negative ang stock.";
    if (form.lowStockLevel < 0)
      nextErrors.lowStockLevel = "Hindi puwedeng negative.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    createInventory.mutate(
      {
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        lowStockLevel: Number(form.lowStockLevel),
      },
      {
        onSuccess: () => {
          setForm(INITIAL_FORM);
          setErrors({});
          onSuccess();
        },
      },
    );
  };

  return (
    <form className="ef" onSubmit={handleSubmit} noValidate>
      <div>
        <label className="ef__label">
          Item Name <span className="ef__req">*</span>
        </label>

        <input
          type="text"
          placeholder="Hal. Bigas, softdrinks, LPG..."
          value={form.name}
          onChange={(event) => set("name", event.target.value)}
        />

        {errors.name && <p className="ef__hint">{errors.name}</p>}
      </div>

      <div>
        <label className="ef__label">
          Category <span className="ef__req">*</span>
        </label>

        <input
          type="text"
          placeholder="Hal. Supplies, Drinks, Food..."
          value={form.category}
          onChange={(event) => set("category", event.target.value)}
        />

        {errors.category && <p className="ef__hint">{errors.category}</p>}
      </div>

      <div className="ef__grid">
        <div>
          <label className="ef__label">
            Price <span className="ef__req">*</span>
          </label>

          <div className="ef__amount">
            <span className="ef__peso">₱</span>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.price === 0 ? "" : form.price}
              onChange={(event) => set("price", Number(event.target.value))}
            />
          </div>

          {errors.price && <p className="ef__hint">{errors.price}</p>}
        </div>

        <div>
          <label className="ef__label">Stock</label>

          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={(event) => set("stock", Number(event.target.value))}
          />

          {errors.stock && <p className="ef__hint">{errors.stock}</p>}
        </div>
      </div>

      <div>
        <label className="ef__label">Low Stock Level</label>

        <input
          type="number"
          min="0"
          value={form.lowStockLevel}
          onChange={(event) => set("lowStockLevel", Number(event.target.value))}
        />

        {errors.lowStockLevel && (
          <p className="ef__hint">{errors.lowStockLevel}</p>
        )}
      </div>

      <button
        type="submit"
        className="ef__submit"
        disabled={createInventory.isPending}
      >
        {createInventory.isPending ? (
          <>
            <Loader2 size={16} className="spin" /> Sine-save...
          </>
        ) : (
          <>
            <PackagePlus size={16} /> I-save ang Item
          </>
        )}
      </button>
    </form>
  );
}

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddInventoryModal({ isOpen, onClose }: AddInventoryModalProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(frame);
    }

    setActive(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen && !active) return null;

  return (
    <div
      className={`modal-bg${active ? " modal-bg--on" : ""}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className={`modal${active ? " modal--on" : ""}`}>
        <div className="modal__head">
          <div>
            <div className="modal__icon">
              <Box size={20} />
            </div>

            <h2 className="modal__title">Mag-add ng Inventory</h2>

            <p className="modal__sub">
              I-record ang bagong item, presyo, stock, at low-stock level.
            </p>
          </div>

          <button
            className="modal__close"
            onClick={onClose}
            type="button"
            aria-label="Isara"
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal__divider" />

        <div className="modal__body">
          <InventoryForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const open = useCallback(() => setModalOpen(true), []);
  const close = useCallback(() => setModalOpen(false), []);

  return (
    <div className="ep">
      <header className="ep__header">
        <div>
          <p className="ep__eyebrow">Imbentaryo Management</p>

          <h1 className="ep__title">Imbentaryo</h1>

          <p className="ep__sub">
            Manage stock, price, category, at low-stock alerts.
          </p>
        </div>

        <button className="btn-add" onClick={open} type="button">
          <Plus size={16} /> Mag-add ng Inventory
        </button>
      </header>

      <InventoryTable />

      <AddInventoryModal isOpen={modalOpen} onClose={close} />
    </div>
  );
}
