import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../services/users.service";

/**
 * LISTAR USERS
 */
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}

/**
 * BUSCAR USER POR ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}

/**
 * CRIAR USER
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}

/**
 * ATUALIZAR USER
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        nome: string;
        email: string;
      };
    }) => updateUser(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      queryClient.invalidateQueries({
        queryKey: ["users", variables.id],
      });
    },
  });
}

/**
 * DELETAR USER (EDGE FUNCTION)
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,

    onSuccess: () => {
      // atualiza lista depois de deletar
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
}