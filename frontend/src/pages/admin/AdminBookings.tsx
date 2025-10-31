import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Skeleton from '../../components/Skeleton';
import Table from '../../components/Table';
import { getAdminBookingsPaged } from '../../services/admin';

export default function AdminBookings() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'bookings', page, sortBy, order],
    queryFn: () => getAdminBookingsPaged({ page, pageSize, sortBy, order }),
    keepPreviousData: true,
  });

  const total = data?.total || 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Bookings</h2>

      <div className="flex gap-2 items-center">
        <select className="border rounded px-3 py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Created</option>
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
          <Table headers={['ID', 'User', 'Destination', 'Status', 'Total', 'Created']}>
            {data.items.map((b: any) => (
              <tr key={b.id} className="border-t">
                <td className="px-3 py-2">{b.id}</td>
                <td className="px-3 py-2">{b.user?.email}</td>
                <td className="px-3 py-2">{b.destination?.name}</td>
                <td className="px-3 py-2">{b.status}</td>
                <td className="px-3 py-2">{b.totalAmount}</td>
                <td className="px-3 py-2">{new Date(b.createdAt).toLocaleString()}</td>
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