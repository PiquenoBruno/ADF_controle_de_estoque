export type Family = {
  id: string;
  responsavel: string;
  telefone: string;
  endereco: string;
  quantidade_pessoas: number;
  observacoes: string;
  created_at: string;
};

export type CreateFamilyDTO = {
  responsavel: string;
  telefone: string;
  endereco: string;
  quantidade_pessoas: number;
  observacoes: string;
};