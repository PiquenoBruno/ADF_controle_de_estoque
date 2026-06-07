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
 * LISTAR CESTAS
 */
export function useBaskets() {
  return useQuery({
    queryKey: ["baskets"],
    queryFn: getBaskets,
  });
}

/**
 * BUSCAR CESTA POR ID
 */
export function useBasket(id: string) {
  return useQuery({
    queryKey: ["basket", id],
    queryFn: () => getBasketById(id),
    enabled: !!id,
  });
}

/**
 * CRIAR CESTA
 */
export function useCreateBasket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBasketDTO) => createBasket(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["baskets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

/**
 * ATUALIZAR CESTA
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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["baskets"] });

      queryClient.invalidateQueries({
        queryKey: ["basket", variables.id],
      });

      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); 
    },
  });
}

/**
 * DELETAR CESTA
 */
export function useDeleteBasket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBasket,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["baskets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); 
    },
  });
}