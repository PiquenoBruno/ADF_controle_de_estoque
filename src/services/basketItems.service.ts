import { supabase } from "./supabase";

/**
 * LISTAR ITENS DA CESTA
 */
export async function getBasketItems(
  basket_id: string
) {
  const { data, error } = await supabase
    .from("basket_items")
    .select(`
      id,
      quantidade,
      basket_id,
      product_id,
      products:product_id (
        id,
        nome,
        unidade
      )
    `)
    .eq("basket_id", basket_id);

  if (error) throw error;

  return data;
}

/**
 * ADICIONAR ITEM (SOMA SE JÁ EXISTIR)
 */
export async function createBasketItem(item: {
  basket_id: string;
  product_id: string;
  quantidade: number;
}) {
  const {
    data: existing,
    error: findError,
  } = await supabase
    .from("basket_items")
    .select("*")
    .eq("basket_id", item.basket_id)
    .eq("product_id", item.product_id)
    .maybeSingle();

  if (findError) throw findError;

  // Se já existe, soma quantidade
  if (existing) {
    const { data, error } = await supabase
      .from("basket_items")
      .update({
        quantidade:
          Number(existing.quantidade) +
          Number(item.quantidade),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  // Se não existe, cria
  const { data, error } = await supabase
    .from("basket_items")
    .insert(item)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * ATUALIZAR QUANTIDADE
 */
export async function updateBasketItem(
  id: string,
  quantidade: number
) {
  const { data, error } = await supabase
    .from("basket_items")
    .update({
      quantidade,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * REMOVER ITEM
 */
export async function deleteBasketItem(
  id: string
) {
  const { error } = await supabase
    .from("basket_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}