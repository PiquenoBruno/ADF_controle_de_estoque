import { getBasketItems } from "./basketItems.service";

export async function buildDeliveryItems(
  basketId: string
) {
  const items =
    await getBasketItems(basketId);

  return items.map((item: any) => ({
    product_id: item.product_id,
    produto: item.products?.nome,
    quantidade: item.quantidade,
  }));
}
