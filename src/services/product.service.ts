import {
  CreateProductDTO,
  Product,
} from "../types/product";
import { supabase } from "./supabase";

export async function getProducts() {
  const { data, error } =
    await supabase
      .from("products")
      .select("*")
      .order("nome");

  if (error) throw error;

  return data as Product[];
}

export async function createProduct(
  product: CreateProductDTO
) {
  const { data, error } =
    await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

  if (error) throw error;

  return data;
}

export async function updateProduct(
  id: string,
  product: Partial<CreateProductDTO>
) {
  const { data, error } =
    await supabase
      .from("products")
      .update(product)
      .eq("id", id)
      .select()
      .single();

  if (error) throw error;

  return data;
}

export async function deleteProduct(
  id: string
) {
  const { error } =
    await supabase
      .from("products")
      .delete()
      .eq("id", id);

  if (error) throw error;
}

export async function getProductById(
  id: string
) {
  const { data, error } =
    await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

  if (error) throw error;

  return data as Product;
}