import {
  AlertTriangle,
  Download,
  Loader2,
  Minus,
  Package,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  useDeleteInventoryItem,
  useInventory,
  useUpdateInventoryItem,
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

type InventoryFormData = {
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockLevel: number;
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

const getInventoryList = (data: unknown): InventoryItem[] => {
  if (Array.isArray(data)) return data;

  if (
    data &&
    typeof data === "object" &&
    "inventory" in data &&
    Array.isArray((data as { inventory?: InventoryItem[] }).inventory)
  ) {
    return (data as { inventory: InventoryItem[] }).inventory;
  }

  if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items?: InventoryItem[] }).items)
  ) {
    return (data as { items: InventoryItem[] }).items;
  }

  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data?: InventoryItem[] }).data)
  ) {
    return (data as { data: InventoryItem[] }).data;
  }

  return [];
};

function TableHead() {
  return (
    <tr>
      <th>Item</th>
      <th>Category</th>
      <th>Price</th>
      <th>Stock</th>
      <th>Status</th>
      <th style={{ textAlign: "right" }}>Controls</th>
      <th style={{ textAlign: "right" }}></th>
    </tr>
  );
}

function SkeletonRow() {
  return (
    <tr className="inv-skel-row">
      <td>
        <div className="inv-skel" style={{ width: 140 }} />
      </td>
      <td>
        <div className="inv-skel" style={{ width: 90 }} />
      </td>
      <td>
        <div className="inv-skel" style={{ width: 80 }} />
      </td>
      <td>
        <div className="inv-skel" style={{ width: 50 }} />
      </td>
      <td>
        <div className="inv-skel" style={{ width: 90 }} />
      </td>
      <td>
        <div className="inv-skel" style={{ width: 80, marginLeft: "auto" }} />
      </td>
      <td>
        <div className="inv-skel" style={{ width: 130, marginLeft: "auto" }} />
      </td>
    </tr>
  );
}

type EditInventoryModalProps = {
  item: InventoryItem | null;
  onClose: () => void;
};

function EditInventoryModal({ item, onClose }: EditInventoryModalProps) {
  const updateInventory = useUpdateInventoryItem();

  const [form, setForm] = useState<InventoryFormData>({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    lowStockLevel: 5,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof InventoryFormData, string>>
  >({});

  useEffect(() => {
    if (!item) return;

    setForm({
      name: item.name,
      category: item.category,
      price: Number(item.price || 0),
      stock: Number(item.stock || 0),
      lowStockLevel: Number(item.lowStockLevel || 5),
    });

    setErrors({});
  }, [item]);

  if (!item) return null;

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
    if (!form.price || form.price <= 0)
      nextErrors.price = "Dapat higit sa 0 ang presyo.";
    if (form.stock < 0) nextErrors.stock = "Hindi puwedeng negative ang stock.";
    if (form.lowStockLevel < 0)
      nextErrors.lowStockLevel = "Hindi puwedeng negative.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    updateInventory.mutate(
      {
        id: item._id,
        payload: {
          name: form.name.trim(),
          category: form.category.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          lowStockLevel: Number(form.lowStockLevel),
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
            <h2 className="modal__title">Edit Inventory</h2>
            <p className="modal__sub">
              Update the item details, price, stock, and low-stock level.
            </p>
          </div>

          <button type="button" className="modal__close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form className="ef" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="ef__label">
              Item Name <span className="ef__req">*</span>
            </label>
            <input
              type="text"
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
              onChange={(event) =>
                set("lowStockLevel", Number(event.target.value))
              }
            />
            {errors.lowStockLevel && (
              <p className="ef__hint">{errors.lowStockLevel}</p>
            )}
          </div>

          <button
            type="submit"
            className="ef__submit"
            disabled={updateInventory.isPending}
          >
            {updateInventory.isPending ? (
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

export default function InventoryTable() {
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);

  const { data, isLoading } = useInventory();
  const updateStock = useUpdateInventoryStock();
  const deleteItem = useDeleteInventoryItem();

  const items = getInventoryList(data);

  const totalValue = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.stock || 0),
    0,
  );

  const count = items.length;

  const downloadExcel = async () => {
    const XLSX = await import("xlsx");

    const rows: {
      Item: string;
      Category: string;
      Price: number;
      Stock: number;
      "Low Stock Level": number;
      Status: string;
      "Inventory Value": number;
    }[] = items.map((item) => {
      const isLowStock = item.stock <= item.lowStockLevel;

      return {
        Item: item.name,
        Category: item.category,
        Price: Number(item.price || 0),
        Stock: Number(item.stock || 0),
        "Low Stock Level": Number(item.lowStockLevel || 0),
        Status: isLowStock ? "Low Stock" : "Okay",
        "Inventory Value": Number(item.price || 0) * Number(item.stock || 0),
      };
    });

    rows.push({
      Item: "TOTAL",
      Category: "",
      Price: 0,
      Stock: 0,
      "Low Stock Level": 0,
      Status: "",
      "Inventory Value": totalValue,
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 24 },
      { wch: 18 },
      { wch: 14 },
      { wch: 10 },
      { wch: 18 },
      { wch: 14 },
      { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "inventory-report.xlsx");
  };

  const handleStockUpdate = (item: InventoryItem, amount: number) => {
    const updatedStock = Math.max(0, item.stock + amount);

    updateStock.mutate({
      id: item._id,
      stock: updatedStock,
    });
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    deleteItem.mutate(itemToDelete._id, {
      onSuccess: () => setItemToDelete(null),
    });
  };

  return (
    <>
      <div className="it-card">
        <div className="it-toolbar">
          <div className="it-toolbar__left">
            <span className="it-toolbar__title">List of Inventory Items</span>
            {!isLoading && <span className="it-toolbar__count">{count}</span>}
          </div>

          {!isLoading && count > 0 && (
            <div className="it-toolbar__right">
              <div className="it-toolbar__total">
                Inventory Value:{" "}
                <span className="it-toolbar__total-val">
                  {formatAmount(totalValue)}
                </span>
              </div>

              <button
                type="button"
                className="it-download"
                onClick={downloadExcel}
              >
                <Download size={15} />
                Download Excel
              </button>
            </div>
          )}
        </div>

        <div className="it-scroll">
          {isLoading ? (
            <table className="it">
              <thead>
                <TableHead />
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonRow key={`inventory-skeleton-${index}`} />
                ))}
              </tbody>
            </table>
          ) : count === 0 ? (
            <div className="it-empty">
              <div className="it-empty__icon">
                <Package size={24} />
              </div>
              <p className="it-empty__title">No inventory items yet</p>
              <p className="it-empty__sub">
                Add an item to get started with inventory tracking.
              </p>
            </div>
          ) : (
            <table className="it">
              <thead>
                <TableHead />
              </thead>
              <tbody>
                {items.map((item) => {
                  const isLowStock = item.stock <= item.lowStockLevel;

                  return (
                    <tr key={item._id}>
                      <td>
                        <span className="it-name">{item.name}</span>
                      </td>
                      <td>
                        <span className="it-category">{item.category}</span>
                      </td>
                      <td>
                        <span className="it-price">
                          {formatAmount(item.price)}
                        </span>
                      </td>
                      <td>
                        <span className="it-stock">{item.stock}</span>
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
                            disabled={item.stock <= 0 || updateStock.isPending}
                          >
                            <Minus size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStockUpdate(item, 1)}
                            disabled={updateStock.isPending}
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="btn-edit"
                            onClick={() => setItemToEdit(item)}
                          >
                            <Pencil size={13} />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn-del"
                            onClick={() => setItemToDelete(item)}
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

      <EditInventoryModal
        item={itemToEdit}
        onClose={() => setItemToEdit(null)}
      />

      {itemToDelete && (
        <div className="modal-bg modal-bg--on" role="dialog" aria-modal="true">
          <div className="modal modal--on delete-modal">
            <div className="modal__head">
              <div>
                <h2 className="modal__title">Delete Item?</h2>
                <p className="modal__sub">
                  Are you sure you want to delete the item{" "}
                  <strong>{itemToDelete.name}</strong>?
                </p>
              </div>
            </div>

            <div className="delete-modal__actions">
              <button
                type="button"
                className="delete-modal__cancel"
                onClick={() => setItemToDelete(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-modal__confirm"
                disabled={deleteItem.isPending}
                onClick={confirmDelete}
              >
                {deleteItem.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
