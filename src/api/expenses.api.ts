import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

export type ExpensePayload = {
  category: string;
  description: string;
  amount: number;
  date?: string;
};

export const getExpenses = async () => {
  const response = await API.get("/expenses");
  return response.data;
};

export const createExpense = async (payload: ExpensePayload) => {
  const response = await API.post("/expenses", payload);
  return response.data;
};

export const updateExpense = async ({
  id,
  payload,
}: {
  id: string;
  payload: ExpensePayload;
}) => {
  const response = await API.put(`/expenses/${id}`, payload);
  return response.data;
};

export const deleteExpense = async (id: string) => {
  const response = await API.delete(`/expenses/${id}`);
  return response.data;
};

export default API;
