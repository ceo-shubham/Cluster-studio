import AdminOrderDetailClient from "@/components/admin/AdminOrderDetailClient";

export function generateStaticParams() {
  return [{ orderId: "view" }];
}

export default function AdminOrderDetailPage() {
  return <AdminOrderDetailClient />;
}
