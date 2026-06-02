import { supabase } from "./supabase";

import {
  CreateFamilyDTO,
  Family,
} from "../types/family";

export async function getFamilies() {
  const { data, error } =
    await supabase
      .from("families")
      .select("*")
      .order("responsavel");

  if (error) throw error;

  return data as Family[];
}

export async function getFamilyById(
  id: string
) {
  const { data, error } =
    await supabase
      .from("families")
      .select("*")
      .eq("id", id)
      .single();

  if (error) throw error;

  return data as Family;
}

export async function createFamily(
  family: CreateFamilyDTO
) {
  const { data, error } =
    await supabase
      .from("families")
      .insert(family)
      .select()
      .single();

  if (error) throw error;

  return data;
}

export async function updateFamily(
  id: string,
  family: Partial<CreateFamilyDTO>
) {
  const { data, error } =
    await supabase
      .from("families")
      .update(family)
      .eq("id", id)
      .select()
      .single();

  if (error) throw error;

  return data;
}

export async function deleteFamily(
  id: string
) {
  const { error } =
    await supabase
      .from("families")
      .delete()
      .eq("id", id);

  if (error) throw error;
}