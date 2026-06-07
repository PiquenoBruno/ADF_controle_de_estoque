import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createBasketItem,
  deleteBasketItem,
  getBasketItems,
  updateBasketItem,
} from "../services/basketItems.service";

export function useBasketItems(
  basketId: string
) {
  return useQuery({
    queryKey: [
      "basket-items",
      basketId,
    ],
    queryFn: () =>
      getBasketItems(
        basketId
      ),
    enabled: !!basketId,
  });
}

export function useCreateBasketItem() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      createBasketItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "basket-items",
        ],
      });
    },
  });
}

export function useUpdateBasketItem() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      quantidade,
    }: {
      id: string;
      quantidade: number;
    }) =>
      updateBasketItem(
        id,
        quantidade
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "basket-items",
        ],
      });
    },
  });
}

export function useDeleteBasketItem() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      deleteBasketItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "basket-items",
        ],
      });
    },
  });
}