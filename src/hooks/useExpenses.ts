import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createExpense, deleteExpense, getExpenses } from "../api/expenses.api";

export const useExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
    },
  });
};
