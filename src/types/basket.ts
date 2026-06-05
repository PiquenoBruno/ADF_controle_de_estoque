export type Basket = {
  id: string;
  nome: string;
  descricao: string;
  created_at: string;
};

export type CreateBasketDTO = {
  nome: string;
  descricao?: string;
};