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
      .select("*")
      .order("delivered_at", {
        ascending: false,
      }),
  ]);

  const products =
    productsResult.data ?? [];

  const families =
    familiesResult.data ?? [];

  const baskets =
    basketsResult.data ?? [];

  const deliveries =
    deliveriesResult.data ?? [];

  const lowStock =
    products.filter(
      (product: any) =>
        Number(product.quantidade) <=
        Number(product.minimo)
    );

  const pendingDeliveries =
    deliveries.filter(
      (delivery: any) =>
        delivery.status ===
        "Pendente"
    );

  const deliveredCount =
    deliveries.filter(
      (delivery: any) =>
        delivery.status ===
        "Entregue"
    ).length;

  const recentDeliveries =
    deliveries.slice(0, 5);

  return {
    totalProducts:
      products.length,

    totalFamilies:
      families.length,

    totalBaskets:
      baskets.length,

    totalDeliveries:
      deliveries.length,

    deliveredCount,

    pendingDeliveries:
      pendingDeliveries.length,

    lowStock,

    recentDeliveries,

    pendingList: pendingDeliveries,
  };
}