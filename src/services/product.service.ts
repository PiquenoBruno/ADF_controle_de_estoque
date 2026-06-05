import { CreateProductDTO, Product } from "../types/product";
import { supabase } from "./supabase";

/**
 * LISTAR PRODUTOS
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("nome");

  if (error) throw error;

  return data ?? [];
}

/**
 * BUSCAR POR ID
 */
export async function getProductById(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

/**
 * CRIAR PRODUTO
 */
export async function createProduct(product: CreateProductDTO) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * ATUALIZAR PRODUTO
 */
export async function updateProduct(
  id: string,
  product: CreateProductDTO
) {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * DELETAR PRODUTO
 */
export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}