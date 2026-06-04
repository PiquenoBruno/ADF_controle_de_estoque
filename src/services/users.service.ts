import { supabase } from "./supabase";

export interface User {
  id: string;
  nome: string;
  email: string;
  created_at?: string;
}

/**
 * LISTAR USUÁRIOS
 */
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nome, email, created_at")
    .order("nome");

  if (error) throw error;

  return data ?? [];
}

/**
 * BUSCAR USUÁRIO POR ID
 */
export async function getUserById(id: string): Promise<User> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nome, email, created_at")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

/**
 * CRIAR USUÁRIO (AUTH + PROFILE)
 */
export async function createUser(user: {
  nome: string;
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
  });

  if (error) throw error;

  const userId = data.user?.id;

  if (!userId) {
    throw new Error("Erro ao criar usuário no Auth");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      nome: user.nome,
      email: user.email,
    });

  if (profileError) throw profileError;

  return data.user;
}

/**
 * ATUALIZAR USUÁRIO (PROFILE)
 */
export async function updateUser(
  id: string,
  user: {
    nome: string;
    email: string;
  }
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(user)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * ❌ DELETAR USUÁRIO (EDGE FUNCTION + AUTH + PROFILE)
 */
export async function deleteUser(userId: string) {
  console.log("🔥 Chamando Edge Function delete-user:", userId);

  // pega sessão atual (necessário para autorização)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Usuário não autenticado");
  }

  const res = await fetch(
    "https://kinqjmgdnkypepnzcppw.supabase.co/functions/v1/delete-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ userId }),
    }
  );

  const data = await res.json();

  console.log("📡 STATUS:", res.status);
  console.log("📦 RESPOSTA:", data);

  if (!res.ok) {
    throw new Error(data.error || "Erro ao deletar usuário");
  }

  return data;
}