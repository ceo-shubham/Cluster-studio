import OrderDetailClient from "@/components/orders/OrderDetailClient";

export function generateStaticParams() {
  return [{ orderId: "view" }];
}

export default function OrderDetailPage() {
  return <OrderDetailClient />;
}
