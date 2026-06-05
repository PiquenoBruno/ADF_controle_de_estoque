import { supabase } from "./supabase";

import {
  CreateFamilyDTO,
  Family,
} from "../types/family";

/**
 * LISTAR FAMÍLIAS (somente ativas)
 */
export async function getFamilies() {
  const { data, error } = await supabase
    .from("families")
    .select("*")
    .eq("active", true) // 🔥 importante
    .order("responsavel");

  if (error) throw error;

  return data as Family[];
}

/**
 * BUSCAR POR ID
 * (não filtra active aqui porque pode ser usado em edição)
 */
export async function getFamilyById(id: string) {
  const { data, error } = await supabase
    .from("families")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Family;
}

/**
 * CRIAR FAMÍLIA (garante active = true)
 */
export async function createFamily(family: CreateFamilyDTO) {
  const { data, error } = await supabase
    .from("families")
    .insert({
      ...family,
      active: true, // 🔥 garante ativo
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * ATUALIZAR FAMÍLIA
 */
export async function updateFamily(
  id: string,
  family: Partial<CreateFamilyDTO>
) {
  const { data, error } = await supabase
    .from("families")
    .update(family)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * ❌ DELETE REAL NÃO É MAIS USADO
 * ✔ agora é SOFT DELETE (inativar)
 */
export async function deleteFamily(id: string) {
  const { error } = await supabase
    .from("families")
    .update({ active: false }) // 🔥 inativa em vez de apagar
    .eq("id", id);

  if (error) throw error;
}