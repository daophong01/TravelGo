import { useAdminSummary } from '../../hooks/useAdmin';
import Skeleton from '../../components/Skeleton';

export default function AdminDashboard() {
  const { data, isLoading } = useAdminSummary();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      {isLoading && (
        <div className="grid md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      )}
      {!isLoading && data && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card title="Revenue" value={formatCurrency(data.revenue)} />
          <Card title="Bookings" value={data.totalBookings} />
          <Card title="Users" value={data.totalUsers} />
          <Card title="Destinations" value={data.totalDestinations} />
        </div>
      )}
    </div>
  );
}

function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="border rounded p-4">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}