import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

export const getSales = async () => {
  const res = await API.get("/sales");
  return res.data;
};

export const createSale = async (data: any) => {
  const res = await API.post("/sales", data);
  return res.data;
};

export const deleteSale = async (id: string) => {
  const res = await API.delete(`/sales/${id}`);
  return res.data;
};
