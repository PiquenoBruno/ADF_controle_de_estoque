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

import { CreateBasketDTO } from "../types/basket";

/**
 * LISTAR
 */
export function useBaskets() {
  return useQuery({
    queryKey: ["baskets"],
    queryFn: getBaskets,
  });
}

/**
 * BUSCAR POR ID
 */
export function useBasket(id: string) {
  return useQuery({
    queryKey: ["basket", id],
    queryFn: () => getBasketById(id),
    enabled: !!id,
  });
}

/**
 * CRIAR
 */
export function useCreateBasket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBasketDTO) => createBasket(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["baskets"],
      });
    },
  });
}

/**
 * ATUALIZAR
 */
export function useUpdateBasket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      basket,
    }: {
      id: string;
      basket: Partial<CreateBasketDTO>;
    }) => updateBasket(id, basket),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["baskets"],
      });
    },
  });
}

/**
 * DELETAR
 */
export function useDeleteBasket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBasket,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["baskets"],
      });
    },
  });
}