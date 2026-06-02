import { supabase } from "./supabase";

export async function decreaseStock(
  productId: string,
  amount: number
) {
  const { data: product, error: fetchError } =
    await supabase
      .from("products")
      .select("id, nome, quantidade")
      .eq("id", productId)
      .single();

  if (fetchError) throw fetchError;

  if (!product) {
    throw new Error("Produto não encontrado");
  }

  const currentStock = Number(product.quantidade);
  const valueToDecrease = Number(amount);

  if (Number.isNaN(currentStock) || Number.isNaN(valueToDecrease)) {
    throw new Error("Quantidade inválida no estoque");
  }

  if (currentStock < valueToDecrease) {
    throw new Error(
      `Estoque insuficiente para ${product.nome}`
    );
  }

  const { error } = await supabase
    .from("products")
    .update({
      quantidade: currentStock - valueToDecrease,
    })
    .eq("id", productId);

  if (error) throw error;
}

export async function increaseStock(
  productId: string,
  amount: number
) {
  const { data: product, error: fetchError } =
    await supabase
      .from("products")
      .select("id, quantidade")
      .eq("id", productId)
      .single();

  if (fetchError) throw fetchError;

  if (!product) {
    throw new Error("Produto não encontrado");
  }

  const currentStock = Number(product.quantidade);
  const valueToIncrease = Number(amount);

  if (Number.isNaN(currentStock) || Number.isNaN(valueToIncrease)) {
    throw new Error("Quantidade inválida no estoque");
  }

  const { error } = await supabase
    .from("products")
    .update({
      quantidade: currentStock + valueToIncrease,
    })
    .eq("id", productId);

  if (error) throw error;
}