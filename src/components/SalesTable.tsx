import {
  Download,
  Loader2,
  Pencil,
  ReceiptText,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useDeleteSale, useSales, useUpdateSale } from "../hooks/useSales";

import "../style/components/SalesTable.css";

type PaymentMethod = "Cash" | "GCash" | "Maya" | "Card";
type SaleStatus = "Completed" | "Pending" | "Cancelled";

type Sale = {
  _id?: string;
  id?: string | number;
  item: string;
  qty: number;
  price?: number;
  amount: number;
  paymentMethod: PaymentMethod;
  customerName?: string;
  saleDate?: string;
  date?: string;
  status?: SaleStatus;
  createdAt?: string;
};

type SaleFormData = {
  item: string;
  qty: number;
  price: number;
  paymentMethod: PaymentMethod;
  customerName: string;
  saleDate: string;
  status: SaleStatus;
};

const PAYMENT_METHODS: PaymentMethod[] = ["Cash", "GCash", "Maya", "Card"];
const STATUSES: SaleStatus[] = ["Completed", "Pending", "Cancelled"];

const getSaleId = (sale: Sale) => sale._id || sale.id;

const getSalesList = (data: unknown): Sale[] => {
  if (Array.isArray(data)) return data;

  if (
    data &&
    typeof data === "object" &&
    "sales" in data &&
    Array.isArray((data as { sales?: Sale[] }).sales)
  ) {
    return (data as { sales: Sale[] }).sales;
  }

  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data?: Sale[] }).data)
  ) {
    return (data as { data: Sale[] }).data;
  }

  return [];
};

const toInputDate = (date?: string) => {
  if (!date) return new Date().toISOString().slice(0, 10);

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return parsedDate.toISOString().slice(0, 10);
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDate = (date?: string) => {
  if (!date) return "No date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Invalid date";

  return parsedDate.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

function TableHead() {
  return (
    <tr>
      <th>Item</th>
      <th>Qty</th>
      <th>Price</th>
      <th>Amount</th>
      <th>Payment</th>
      <th>Customer</th>
      <th>Date</th>
      <th>Status</th>
      <th style={{ textAlign: "right" }}></th>
    </tr>
  );
}

function SkeletonRow() {
  return (
    <tr className="st-skel-row">
      <td>
        <div className="st-skel" style={{ width: 130 }} />
      </td>
      <td>
        <div className="st-skel" style={{ width: 40 }} />
      </td>
      <td>
        <div className="st-skel" style={{ width: 70 }} />
      </td>
      <td>
        <div className="st-skel" style={{ width: 80 }} />
      </td>
      <td>
        <div className="st-skel" style={{ width: 70 }} />
      </td>
      <td>
        <div className="st-skel" style={{ width: 100 }} />
      </td>
      <td>
        <div className="st-skel" style={{ width: 90 }} />
      </td>
      <td>
        <div className="st-skel" style={{ width: 80 }} />
      </td>
      <td>
        <div className="st-skel" style={{ width: 130, marginLeft: "auto" }} />
      </td>
    </tr>
  );
}

function EditSaleModal({
  sale,
  onClose,
}: {
  sale: Sale | null;
  onClose: () => void;
}) {
  const updateSale = useUpdateSale();

  const [form, setForm] = useState<SaleFormData>({
    item: "",
    qty: 1,
    price: 0,
    paymentMethod: "Cash",
    customerName: "Walk-in",
    saleDate: new Date().toISOString().slice(0, 10),
    status: "Completed",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SaleFormData, string>>
  >({});

  useEffect(() => {
    if (!sale) return;

    const price = sale.price ?? sale.amount / Math.max(sale.qty, 1);

    setForm({
      item: sale.item,
      qty: Number(sale.qty || 1),
      price: Number(price || 0),
      paymentMethod: sale.paymentMethod || "Cash",
      customerName: sale.customerName || "Walk-in",
      saleDate: toInputDate(sale.saleDate || sale.date || sale.createdAt),
      status: sale.status || "Completed",
    });

    setErrors({});
  }, [sale]);

  if (!sale) return null;

  const amount = Number(form.qty || 0) * Number(form.price || 0);

  const set = <K extends keyof SaleFormData>(
    key: K,
    value: SaleFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const id = getSaleId(sale);

    if (!id) {
      console.error("Sale ID missing:", sale);
      return;
    }

    const nextErrors: Partial<Record<keyof SaleFormData, string>> = {};

    if (!form.item.trim()) nextErrors.item = "Kailangan ng item.";
    if (!form.qty || form.qty <= 0)
      nextErrors.qty = "Dapat higit sa 0 ang quantity.";
    if (!form.price || form.price <= 0)
      nextErrors.price = "Dapat higit sa 0 ang price.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    updateSale.mutate(
      {
        id: String(id),
        payload: {
          item: form.item.trim(),
          qty: Number(form.qty),
          price: Number(form.price),
          amount,
          paymentMethod: form.paymentMethod,
          customerName: form.customerName.trim() || "Walk-in",
          saleDate: form.saleDate,
          status: form.status,
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
            <h2 className="modal__title">Edit Sale</h2>
            <p className="modal__sub">
              Update the details of the selected sale.
            </p>
          </div>

          <button type="button" className="modal__close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form className="ef" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="ef__label">
              Item <span className="ef__req">*</span>
            </label>
            <input
              type="text"
              value={form.item}
              onChange={(event) => set("item", event.target.value)}
            />
            {errors.item && <p className="ef__hint">{errors.item}</p>}
          </div>

          <div className="ef__grid">
            <div>
              <label className="ef__label">
                Quantity <span className="ef__req">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={form.qty}
                onChange={(event) => set("qty", Number(event.target.value))}
              />
              {errors.qty && <p className="ef__hint">{errors.qty}</p>}
            </div>

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
          </div>

          <div>
            <span className="ef__label">Payment Method</span>
            <div className="ef__chips">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method}
                  type="button"
                  className={`chip${form.paymentMethod === method ? " chip--on" : ""}`}
                  onClick={() => set("paymentMethod", method)}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="ef__grid">
            <div>
              <label className="ef__label">Customer</label>
              <input
                type="text"
                value={form.customerName}
                onChange={(event) => set("customerName", event.target.value)}
              />
            </div>

            <div>
              <label className="ef__label">Sale Date</label>
              <input
                type="date"
                value={form.saleDate}
                onChange={(event) => set("saleDate", event.target.value)}
              />
            </div>
          </div>

          <div>
            <span className="ef__label">Status</span>
            <div className="ef__chips">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`chip${form.status === status ? " chip--on" : ""}`}
                  onClick={() => set("status", status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="ef__summary">
            Total Amount: <strong>{formatAmount(amount)}</strong>
          </div>

          <button
            type="submit"
            className="ef__submit"
            disabled={updateSale.isPending}
          >
            {updateSale.isPending ? (
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

export default function SalesTable() {
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const [saleToEdit, setSaleToEdit] = useState<Sale | null>(null);

  const { data, isLoading } = useSales();
  const deleteSale = useDeleteSale();

  const sales = getSalesList(data);

  const totalSales = sales.reduce(
    (sum, sale) => sum + Number(sale.amount || 0),
    0,
  );

  const count = sales.length;

  const downloadExcel = async () => {
    const XLSX = await import("xlsx");

    const rows: {
      Item: string;
      Qty: number;
      Price: number;
      Amount: number;
      Payment: string;
      Customer: string;
      Date: string;
      Status: string;
    }[] = sales.map((sale) => {
      const price = sale.price ?? sale.amount / Math.max(sale.qty, 1);

      return {
        Item: sale.item,
        Qty: Number(sale.qty || 0),
        Price: Number(price || 0),
        Amount: Number(sale.amount || 0),
        Payment: sale.paymentMethod,
        Customer: sale.customerName || "Walk-in",
        Date: formatDate(sale.saleDate || sale.date || sale.createdAt),
        Status: sale.status || "Completed",
      };
    });

    rows.push({
      Item: "TOTAL",
      Qty: 0,
      Price: 0,
      Amount: totalSales,
      Payment: "",
      Customer: "",
      Date: "",
      Status: "",
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 24 },
      { wch: 10 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 20 },
      { wch: 18 },
      { wch: 16 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
    XLSX.writeFile(workbook, "sales-report.xlsx");
  };

  const confirmDelete = () => {
    if (!saleToDelete) return;

    const id = getSaleId(saleToDelete);

    if (!id) {
      console.error("Sale ID missing:", saleToDelete);
      return;
    }

    deleteSale.mutate(String(id), {
      onSuccess: () => setSaleToDelete(null),
    });
  };

  return (
    <>
      <div className="st-card">
        <div className="st-toolbar">
          <div className="st-toolbar__left">
            <span className="st-toolbar__title">List of Sales</span>
            {!isLoading && <span className="st-toolbar__count">{count}</span>}
          </div>

          {!isLoading && count > 0 && (
            <div className="st-toolbar__right">
              <div className="st-toolbar__total">
                Total Sales:{" "}
                <span className="st-toolbar__total-val">
                  {formatAmount(totalSales)}
                </span>
              </div>

              <button
                type="button"
                className="st-download"
                onClick={downloadExcel}
              >
                <Download size={15} />
                Download Excel
              </button>
            </div>
          )}
        </div>

        <div className="st-scroll">
          {isLoading ? (
            <table className="st">
              <thead>
                <TableHead />
              </thead>
              <tbody>
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonRow key={`sales-skeleton-${index}`} />
                ))}
              </tbody>
            </table>
          ) : count === 0 ? (
            <div className="st-empty">
              <div className="st-empty__icon">
                <ReceiptText size={24} />
              </div>
              <p className="st-empty__title">No sales yet</p>
              <p className="st-empty__sub">Click "Log Sale" to get started.</p>
            </div>
          ) : (
            <table className="st">
              <thead>
                <TableHead />
              </thead>
              <tbody>
                {sales.map((sale, index) => {
                  const id = getSaleId(sale);
                  const rowKey = id ? String(id) : `sale-${index}`;
                  const price =
                    sale.price ?? sale.amount / Math.max(sale.qty, 1);

                  return (
                    <tr key={rowKey}>
                      <td>
                        <span className="st-item">{sale.item}</span>
                      </td>
                      <td>
                        <span className="st-qty">{sale.qty}</span>
                      </td>
                      <td>
                        <span className="st-price">{formatAmount(price)}</span>
                      </td>
                      <td>
                        <span className="st-amount">
                          {formatAmount(sale.amount)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`payment-badge payment-${sale.paymentMethod}`}
                        >
                          {sale.paymentMethod}
                        </span>
                      </td>

                      <td>
                        <span className="st-customer">
                          {sale.customerName || "Walk-in"}
                        </span>
                      </td>

                      <td>
                        <span className="st-date">
                          {formatDate(
                            sale.saleDate || sale.date || sale.createdAt,
                          )}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${sale.status || "Completed"}`}
                        >
                          {sale.status || "Completed"}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="btn-edit"
                            onClick={() => setSaleToEdit(sale)}
                          >
                            <Pencil size={13} />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn-del"
                            onClick={() => setSaleToDelete(sale)}
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

      <EditSaleModal sale={saleToEdit} onClose={() => setSaleToEdit(null)} />

      {saleToDelete && (
        <div className="modal-bg modal-bg--on" role="dialog" aria-modal="true">
          <div className="modal modal--on delete-modal">
            <div className="modal__head">
              <div>
                <h2 className="modal__title">Delete Sale?</h2>
                <p className="modal__sub">
                  Are you sure you want to delete the sale for{" "}
                  <strong>{saleToDelete.item}</strong>?
                </p>
              </div>
            </div>

            <div className="delete-modal__actions">
              <button
                type="button"
                className="delete-modal__cancel"
                onClick={() => setSaleToDelete(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-modal__confirm"
                disabled={deleteSale.isPending}
                onClick={confirmDelete}
              >
                {deleteSale.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
