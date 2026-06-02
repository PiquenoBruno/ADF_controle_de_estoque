import { supabase } from "./supabase";

import {
    Basket,
    CreateBasketDTO,
} from "../types/basket";

export async function getBaskets() {
  const { data, error } =
    await supabase
      .from("baskets")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) throw error;

  return data as Basket[];
}

export async function getBasketById(
  id: string
) {
  const { data, error } =
    await supabase
      .from("baskets")
      .select("*")
      .eq("id", id)
      .single();

  if (error) throw error;

  return data as Basket;
}

export async function createBasket(
  basket: CreateBasketDTO
) {
  const { data, error } =
    await supabase
      .from("baskets")
      .insert(basket)
      .select()
      .single();

  if (error) throw error;

  return data;
}

export async function updateBasket(
  id: string,
  basket: Partial<CreateBasketDTO>
) {
  const { data, error } =
    await supabase
      .from("baskets")
      .update(basket)
      .eq("id", id)
      .select()
      .single();

  if (error) throw error;

  return data;
}

export async function deleteBasket(
  id: string
) {
  const { error } =
    await supabase
      .from("baskets")
      .delete()
      .eq("id", id);

  if (error) throw error;
}