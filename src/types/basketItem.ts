export type BasketItem = {
  id: string;
  basket_id: string;
  product_id: string;
  quantidade: number;

  // 🔥 isso é o JOIN do Supabase (products:product_id)
  products: {
    id: string;
    nome: string;
    quantidade: number;
  } | null;
};

export type CreateBasketItemDTO = {
  basket_id: string;
  product_id: string;
  quantidade: number;
};