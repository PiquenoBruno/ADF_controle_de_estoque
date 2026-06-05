export type DeliveryStatus =
  | "Pendente"
  | "Entregue"
  | "Cancelada";

export type Family = {
  id: string;
  responsavel: string;
};

export type Delivery = {
  id: string;
  family_id: string;
  basket_id: string;
  basket_name: string;
  observacao: string;
  status: DeliveryStatus;
  delivered_at: string;
  items?: any[];
  family?: Family | null;
};

export type CreateDeliveryDTO = {
  family_id: string;
  basket_id: string;
  basket_name: string;
  observacao: string;
  items: any[];
  status: DeliveryStatus;
  delivered_at: string;
};