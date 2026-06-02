import { supabase } from "./supabase";

import {
    CreateDeliveryDTO,
    Delivery,
} from "../types/delivery";

export async function getDeliveries() {
  const { data, error } =
    await supabase
      .from("deliveries")
      .select("*")
      .order("delivered_at", {
        ascending: false,
      });

  if (error) throw error;

  return data as Delivery[];
}

export async function getDeliveryById(
  id: string
) {
  const { data, error } =
    await supabase
      .from("deliveries")
      .select("*")
      .eq("id", id)
      .single();

  if (error) throw error;

  return data as Delivery;
}

export async function createDelivery(
  delivery: CreateDeliveryDTO
) {
  const { data, error } =
    await supabase
      .from("deliveries")
      .insert(delivery)
      .select()
      .single();

  if (error) throw error;

  return data;
}

export async function deleteDelivery(
  id: string
) {
  const { error } =
    await supabase
      .from("deliveries")
      .delete()
      .eq("id", id);

  if (error) throw error;
}