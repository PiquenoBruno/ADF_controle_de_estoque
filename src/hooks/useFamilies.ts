import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createFamily,
  deleteFamily,
  getFamilies,
  getFamilyById,
  updateFamily,
} from "../services/families.service";

/**
 * LISTAR FAMÍLIAS
 */
export function useFamilies() {
  return useQuery({
    queryKey: ["families"],
    queryFn: getFamilies,
  });
}

/**
 * BUSCAR FAMÍLIA POR ID
 */
export function useFamily(id: string) {
  return useQuery({
    queryKey: ["family", id],
    queryFn: () => getFamilyById(id),
    enabled: !!id,
  });
}

/**
 * CRIAR FAMÍLIA
 */
export function useCreateFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFamily,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); 
    },
  });
}

/**
 * ATUALIZAR FAMÍLIA
 */
export function useUpdateFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, family }: any) =>
      updateFamily(id, family),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["families"] });

      queryClient.invalidateQueries({
        queryKey: ["family", variables.id],
      });

      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); 
    },
  });
}

/**
 * DELETAR FAMÍLIA
 */
export function useDeleteFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFamily,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}