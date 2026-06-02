export type Basket = {
  id: string;
  nome: string;
  descricao: string;
  family_id: string;
  status: string;
  entregue: boolean;
  created_at: string;
};

export type CreateBasketDTO = {
  nome: string;
  descricao: string;
  family_id: string;
  status: string;
  entregue: boolean;
};