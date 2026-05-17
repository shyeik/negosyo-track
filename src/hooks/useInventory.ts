import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createInventoryItem,
  deleteInventoryItem,
  getInventory,
  updateInventoryStock,
} from "../api/inventory.api";

export const useInventory = () => {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: getInventory,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventoryItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });
    },
  });
};

export const useUpdateInventoryStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInventoryStock,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInventoryItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });
    },
  });
};
