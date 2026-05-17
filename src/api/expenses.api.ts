import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

export const getExpenses = async () => {
  const res = await API.get("/expenses");
  return res.data;
};

export const createExpense = async (data: any) => {
  const res = await API.post("/expenses", data);

  return res.data;
};

export const deleteExpense = async (id: string) => {
  const res = await API.delete(`/expenses/${id}`);

  return res.data;
};
