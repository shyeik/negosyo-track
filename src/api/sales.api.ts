import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

export type SalePayload = {
  item: string;
  qty: number;
  price: number;
  amount: number;
  paymentMethod: "Cash" | "GCash" | "Maya" | "Card";
  customerName?: string;
  saleDate?: string;
  status?: "Completed" | "Pending" | "Cancelled";
};

export const getSales = async () => {
  const response = await API.get("/sales");
  return response.data;
};

export const createSale = async (payload: SalePayload) => {
  const response = await API.post("/sales", payload);

  return response.data;
};

export const updateSale = async ({
  id,
  payload,
}: {
  id: string;
  payload: SalePayload;
}) => {
  const response = await API.put(`/sales/${id}`, payload);

  return response.data;
};

export const deleteSale = async (id: string) => {
  const response = await API.delete(`/sales/${id}`);

  return response.data;
};

export default API;
