import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

export type InventoryPayload = {
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockLevel: number;
};

export const getInventory = async () => {
  const response = await API.get("/inventory");
  return response.data;
};

export const createInventoryItem = async (payload: InventoryPayload) => {
  const response = await API.post("/inventory", payload);

  return response.data;
};

export const updateInventoryItem = async ({
  id,
  payload,
}: {
  id: string;
  payload: InventoryPayload;
}) => {
  const response = await API.put(`/inventory/${id}`, payload);

  return response.data;
};

export const updateInventoryStock = async ({
  id,
  stock,
}: {
  id: string;
  stock: number;
}) => {
  const response = await API.patch(`/inventory/${id}/stock`, {
    stock,
  });

  return response.data;
};

export const deleteInventoryItem = async (id: string) => {
  const response = await API.delete(`/inventory/${id}`);

  return response.data;
};

export default API;
