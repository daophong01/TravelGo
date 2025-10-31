import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Skeleton from '../../components/Skeleton';
import Table from '../../components/Table';
import { getAdminPaymentsPaged } from '../../services/admin';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function AdminPayments() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'payments', page, sortBy, order],
    queryFn: () => getAdminPaymentsPaged({ page, pageSize, sortBy, order }),
    keepPreviousData: true,
  });

  const total = data?.total || 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payments</h2>

      <div className="flex gap-2 items-center">
        <select className="border rounded px-3 py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Created</option>
          <option value="amount">Amount</option>
          <option value="status">Status</option>
        </select>
        <select className="border rounded px-3 py-2" value={order} onChange={(e) => setOrder(e.target.value as any)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
        </div>
      )}

      {!isLoading && data && (
        <>
          <Table headers={['ID', 'User', 'Destination', 'Amount', 'Status', 'Provider', 'Created']}>
            {data.items.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2">{p.id}</td>
                <td className="px-3 py-2">{p.booking?.user?.email}</td>
                <td className="px-3 py-2">{p.booking?.destination?.name}</td>
                <td className="px-3 py-2">{formatCurrency(p.amount)}</td>
                <td className="px-3 py-2">{p.status}</td>
                <td className="px-3 py-2">{p.provider}</td>
                <td className="px-3 py-2">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </Table>

          <div className="flex items-center gap-2 mt-3">
            <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <span className="text-sm">{page} / {pageCount}</span>
            <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setPage((p) => (p < pageCount ? p + 1 : p))} disabled={page >= pageCount}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}