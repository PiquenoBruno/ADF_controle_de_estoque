import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../services/product.service";

import { Product } from "../types/product";

/**
 * LISTAR PRODUTOS
 */
export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}

/**
 * BUSCAR POR ID
 */
export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

/**
 * CRIAR PRODUTO
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

/**
 * ATUALIZAR PRODUTO
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

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
    }) => updateProduct(id, product),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

/**
 * DELETAR PRODUTO
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}