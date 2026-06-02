import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createBasket,
    deleteBasket,
    getBasketById,
    getBaskets,
    updateBasket,
} from "../services/baskets.service";

export function useBaskets() {
  return useQuery({
    queryKey: ["baskets"],
    queryFn: getBaskets,
  });
}

export function useBasket(
  id: string
) {
  return useQuery({
    queryKey: ["basket", id],
    queryFn: () =>
      getBasketById(id),
    enabled: !!id,
  });
}

export function useCreateBasket() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createBasket,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["baskets"],
      });
    },
  });
}

export function useUpdateBasket() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      basket,
    }: any) =>
      updateBasket(id, basket),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["baskets"],
      });
    },
  });
}

export function useDeleteBasket() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteBasket,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["baskets"],
      });
    },
  });
}