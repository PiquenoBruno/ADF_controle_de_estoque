import { Basket, CreateBasketDTO } from "../types/basket";
import { supabase } from "./supabase";

/**
 * LISTAR CESTAS
 */
export async function getBaskets() {
  const { data, error } = await supabase
    .from("baskets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Basket[];
}

/**
 * BUSCAR POR ID
 */
export async function getBasketById(id: string) {
  const { data, error } = await supabase
    .from("baskets")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Basket;
}

/**
 * CRIAR CESTA
 */
export async function createBasket(data: CreateBasketDTO) {
  const { data: result, error } = await supabase
    .from("baskets")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result;
}

/**
 * ATUALIZAR CESTA
 */
export async function updateBasket(
  id: string,
  basket: Partial<CreateBasketDTO>
) {
  const { data, error } = await supabase
    .from("baskets")
    .update({
      nome: basket.nome,
      descricao: basket.descricao,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Basket;
}

/**
 * DELETAR CESTA
 */
export async function deleteBasket(id: string) {
  const { error } = await supabase
    .from("baskets")
    .delete()
    .eq("id", id);

  if (error) throw error;
}