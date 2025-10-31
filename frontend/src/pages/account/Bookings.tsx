import Skeleton from '../../components/Skeleton';
import Table from '../../components/Table';
import { getCurrentUser } from '../../lib/auth';
import { useQuery } from '@tanstack/react-query';
import { getUserBookings } from '../../services/booking';

export default function Bookings() {
  const me = getCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ['bookings', me?.id],
    queryFn: () => getUserBookings(me!.id),
    enabled: !!me?.id,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Đơn đặt</h2>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
        </div>
      )}

      {!isLoading && (!data || data.length === 0) && (
        <div className="text-sm text-gray-500">Bạn chưa có đơn đặt nào.</div>
      )}

      {!isLoading && data && data.length > 0 && (
        <Table headers={['Mã', 'Điểm đến', 'Trạng thái']}>
          {data.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="px-3 py-2">{b.id}</td>
              <td className="px-3 py-2">{(b as any).destination || '-'}</td>
              <td className="px-3 py-2">{b.status}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}