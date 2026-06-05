import { CreateDeliveryDTO, Delivery } from "../types/delivery";
import { supabase } from "./supabase";

export async function getDeliveries() {
  const { data, error } = await supabase
    .from("deliveries")
    .select(`
      id,
      basket_name,
      observacao,
      status,
      delivered_at,
      family:families (
        id,
        responsavel
      )
    `)
    .order("delivered_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function getDeliveryById(id: string) {
  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createDelivery(delivery: CreateDeliveryDTO) {
  const { data, error } = await supabase
    .from("deliveries")
    .insert(delivery)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateDelivery(
  id: string,
  delivery: Partial<Delivery>
) {
  const { data, error } = await supabase
    .from("deliveries")
    .update(delivery)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteDelivery(id: string) {
  const { error } = await supabase
    .from("deliveries")
    .delete()
    .eq("id", id);

  if (error) throw error;
}