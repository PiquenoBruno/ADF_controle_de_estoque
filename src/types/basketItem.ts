export type BasketItem = {
  id: string;
  basket_id: string;
  product_id: string;
  quantidade: number;
};

export type CreateBasketItemDTO = {
  basket_id: string;
  product_id: string;
  quantidade: number;
};