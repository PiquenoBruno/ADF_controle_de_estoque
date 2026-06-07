import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createDelivery,
  deleteDelivery,
  getDeliveries,
  getDeliveryById,
  updateDelivery,
} from "../services/deliveries.service";

/**
 * LISTAR ENTREGAS
 */
export function useDeliveries() {
  return useQuery({
    queryKey: ["deliveries"],
    queryFn: getDeliveries,
  });
}

/**
 * BUSCAR ENTREGA POR ID
 */
export function useDelivery(id: string) {
  return useQuery({
    queryKey: ["delivery", id],
    queryFn: () => getDeliveryById(id),
    enabled: !!id,
  });
}

/**
 * CRIAR ENTREGA
 */
export function useCreateDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDelivery,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); 
    },
  });
}

/**
 * ATUALIZAR ENTREGA
 */
export function useUpdateDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, delivery }: any) =>
      updateDelivery(id, delivery),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });

      queryClient.invalidateQueries({
        queryKey: ["delivery", variables.id],
      });

      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); 
    },
  });
}

/**
 * DELETAR ENTREGA
 */
export function useDeleteDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDelivery,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); 
    },
  });
}