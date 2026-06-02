import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createBasketItem,
    deleteBasketItem,
    getBasketItems,
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
      queryClient.invalidateQueries();
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
      queryClient.invalidateQueries();
    },
  });
}