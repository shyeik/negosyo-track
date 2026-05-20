import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSale, deleteSale, getSales, updateSale } from "../api/sales.api";

export const useSales = () => {
  return useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSale,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
    },
  });
};

export const useUpdateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSale,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
    },
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSale,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
    },
  });
};
