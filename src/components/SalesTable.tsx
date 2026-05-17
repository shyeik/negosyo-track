import { Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { useDeleteSale, useSales } from "../hooks/useSales";

import "../style/components/SalesTable.css";

type Sale = {
  _id: string;
  item: string;
  amount: number;
  qty: number;
  paymentMethod: "Cash" | "GCash" | "Maya" | "Card";
  date: string;
};

const money = (value: number) => `₱${value.toLocaleString("en-PH")}`;

export default function SalesTable() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useSales();

  const sales = Array.isArray(data)
    ? data
    : Array.isArray(data?.sales)
      ? data.sales
      : Array.isArray(data?.data)
        ? data.data
        : [];

  const deleteSale = useDeleteSale();

  const filteredSales = useMemo(() => {
    return sales.filter((sale: Sale) =>
      sale.item.toLowerCase().includes(search.toLowerCase()),
    );
  }, [sales, search]);

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Tanggalin ang sale na ito?");

    if (!confirmed) return;

    deleteSale.mutate(id);
  };

  if (isLoading) {
    return (
      <section className="sales-table">
        <div className="empty-state">Loading sales...</div>
      </section>
    );
  }

  return (
    <section className="sales-table">
      <div className="sales-table__header">
        <div>
          <h3>Recent Benta</h3>
          <p>Latest business transactions</p>
        </div>

        <div className="sales-search">
          <Search size={16} />

          <input
            type="text"
            placeholder="Search item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sales-table__wrapper">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Bayad</th>
              <th>Halaga</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredSales.map((sale: Sale) => (
              <tr key={sale._id}>
                <td>
                  <strong>{sale.item}</strong>
                </td>

                <td>{sale.qty}</td>

                <td>
                  <span
                    className={`payment-badge ${sale.paymentMethod.toLowerCase()}`}
                  >
                    {sale.paymentMethod}
                  </span>
                </td>

                <td>{money(sale.amount)}</td>

                <td>
                  {new Date(sale.date).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(sale._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSales.length === 0 && (
          <div className="empty-state">Walang result sa search.</div>
        )}
      </div>
    </section>
  );
}
