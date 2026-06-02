import { supabase } from "./supabase";

import {
    CreateBasketItemDTO
} from "../types/basketItem";

export async function getBasketItems(
  basketId: string
) {
  const { data, error } =
    await supabase
      .from("basket_items")
      .select(`
        *,
        products (
          id,
          nome,
          unidade
        )
      `)
      .eq("basket_id", basketId);

  if (error) throw error;

  return data;
}

export async function createBasketItem(
  item: CreateBasketItemDTO
) {
  const { data, error } =
    await supabase
      .from("basket_items")
      .insert(item)
      .select()
      .single();

  if (error) throw error;

  return data;
}

export async function deleteBasketItem(
  id: string
) {
  const { error } =
    await supabase
      .from("basket_items")
      .delete()
      .eq("id", id);

  if (error) throw error;
}