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

export function useFamilies() {
  return useQuery({
    queryKey: ["families"],
    queryFn: getFamilies,
  });
}

export function useFamily(
  id: string
) {
  return useQuery({
    queryKey: ["family", id],
    queryFn: () =>
      getFamilyById(id),
    enabled: !!id,
  });
}

export function useCreateFamily() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createFamily,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["families"],
      });
    },
  });
}

export function useUpdateFamily() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      family,
    }: any) =>
      updateFamily(id, family),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["families"],
      });
    },
  });
}

export function useDeleteFamily() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteFamily,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["families"],
      });
    },
  });
}