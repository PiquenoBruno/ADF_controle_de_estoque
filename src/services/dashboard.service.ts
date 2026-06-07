import { supabase } from "./supabase";

export async function getDashboardData() {
  const [
    productsResult,
    familiesResult,
    basketsResult,
    deliveriesResult,
  ] = await Promise.all([
    supabase.from("products").select("*"),
    supabase.from("families").select("*"),
    supabase.from("baskets").select("*"),
    supabase
      .from("deliveries")
      .select(`
        id,
        basket_name,
        status,
        delivered_at,
        families:family_id (
          responsavel
        )
      `)
      .order("delivered_at", { ascending: false }),
  ]);

  const products = productsResult.data ?? [];
  const families = familiesResult.data ?? [];
  const baskets = basketsResult.data ?? [];

  const deliveries = (deliveriesResult.data ?? []).map((d: any) => ({
    id: d.id,
    basket_name: d.basket_name,
    status: d.status,
    delivered_at: d.delivered_at,
    family_name: d.families?.responsavel ?? "Sem família",
  }));

  const lowStock = products.filter(
    (product: any) =>
      Number(product.quantidade) <= Number(product.minimo)
  );

  const pendingDeliveries = deliveries.filter(
    (delivery: any) => delivery.status === "Pendente"
  );

  const deliveredCount = deliveries.filter(
    (delivery: any) => delivery.status === "Entregue"
  ).length;

  const recentDeliveries = deliveries.slice(0, 5);

  return {
    totalProducts: products.length,
    totalFamilies: families.length,
    totalBaskets: baskets.length,
    totalDeliveries: deliveries.length,
    deliveredCount,
    pendingDeliveries: pendingDeliveries.length,
    lowStock,
    recentDeliveries,
    pendingList: pendingDeliveries,
  };
}