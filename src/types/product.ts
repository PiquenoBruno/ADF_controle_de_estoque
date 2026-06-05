export type Product = {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  minimo: number;
  created_at: string;
};

export type CreateProductDTO = {
  nome: string;
  quantidade: number;
  unidade: string;
  minimo: number;
};