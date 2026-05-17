import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

export const getInventory = async () => {
  const res = await API.get("/inventory");
  return res.data;
};

export const createInventoryItem = async (data: any) => {
  const res = await API.post("/inventory", data);

  return res.data;
};

export const updateInventoryStock = async ({
  id,
  stock,
}: {
  id: string;
  stock: number;
}) => {
  const res = await API.patch(`/inventory/${id}/stock`, {
    stock,
  });

  return res.data;
};

export const deleteInventoryItem = async (id: string) => {
  const res = await API.delete(`/inventory/${id}`);

  return res.data;
};
