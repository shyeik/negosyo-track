import { Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import "../style/components/SalesTable.css";

type Sale = {
  id: number;
  item: string;
  amount: number;
  qty: number;
  payment: "Cash" | "GCash" | "Maya" | "Card";
  date: string;
};

const mockSales: Sale[] = [
  {
    id: 1,
    item: "Kape",
    amount: 120,
    qty: 2,
    payment: "Cash",
    date: "May 17, 2026",
  },
  {
    id: 2,
    item: "Pandesal",
    amount: 85,
    qty: 5,
    payment: "GCash",
    date: "May 17, 2026",
  },
  {
    id: 3,
    item: "Softdrinks",
    amount: 240,
    qty: 6,
    payment: "Maya",
    date: "May 17, 2026",
  },
  {
    id: 4,
    item: "Noodles",
    amount: 160,
    qty: 4,
    payment: "Card",
    date: "May 17, 2026",
  },
];

const money = (value: number) => `₱${value.toLocaleString("en-PH")}`;

export default function SalesTable() {
  const [search, setSearch] = useState("");

  const filteredSales = useMemo(() => {
    return mockSales.filter((sale) =>
      sale.item.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

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
            {filteredSales.map((sale) => (
              <tr key={sale.id}>
                <td>
                  <strong>{sale.item}</strong>
                </td>

                <td>{sale.qty}</td>

                <td>
                  <span
                    className={`payment-badge ${sale.payment.toLowerCase()}`}
                  >
                    {sale.payment}
                  </span>
                </td>

                <td>{money(sale.amount)}</td>

                <td>{sale.date}</td>

                <td>
                  <button className="delete-btn">
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
