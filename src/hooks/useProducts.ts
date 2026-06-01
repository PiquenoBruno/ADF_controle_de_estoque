import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../services/product.service";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}

export function useProduct(
  id: string
) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      product,
    }: {
      id: string;
      product: {
        nome: string;
        quantidade: number;
        unidade: string;
        minimo: number;
      };
    }) =>
      updateProduct(id, product),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["product"],
      });
    },
  });

  
}

export function useDeleteProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteProduct(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}
