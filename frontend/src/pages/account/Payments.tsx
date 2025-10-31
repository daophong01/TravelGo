import Skeleton from '../../components/Skeleton';
import Table from '../../components/Table';
import { getCurrentUser } from '../../lib/auth';
import { useQuery } from '@tanstack/react-query';
import { getUserPayments } from '../../services/payment';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function Payments() {
  const me = getCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ['payments', me?.id],
    queryFn: () => getUserPayments(me!.id),
    enabled: !!me?.id,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payments</h2>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
        </div>
      )}

      {!isLoading && (!data || data.length === 0) && (
        <div className="text-sm text-gray-500">No payments found.</div>
      )}

      {!isLoading && data && data.length > 0 && (
        <Table headers={['ID', 'Amount', 'Status', 'Provider']}>
          {data.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-3 py-2">{p.id}</td>
              <td className="px-3 py-2">{formatCurrency(p.amount)}</td>
              <td className="px-3 py-2">{p.status}</td>
              <td className="px-3 py-2">{p.provider}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}