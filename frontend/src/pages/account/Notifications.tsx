import Skeleton from '../../components/Skeleton';
import Table from '../../components/Table';
import { getCurrentUser } from '../../lib/auth';
import { useQuery } from '@tanstack/react-query';
import { getUserNotifications } from '../../services/notification';

export default function Notifications() {
  const me = getCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ['notifications', me?.id],
    queryFn: () => getUserNotifications(me!.id),
    enabled: !!me?.id,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Notifications</h2>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
        </div>
      )}

      {!isLoading && (!data || data.length === 0) && (
        <div className="text-sm text-gray-500">No notifications.</div>
      )}

      {!isLoading && data && data.length > 0 && (
        <Table headers={['ID', 'Type', 'Message', 'Created At', 'Read']}>
          {data.map((n) => (
            <tr key={n.id} className="border-t">
              <td className="px-3 py-2">{n.id}</td>
              <td className="px-3 py-2">{n.type}</td>
              <td className="px-3 py-2">{n.message}</td>
              <td className="px-3 py-2">{new Date(n.createdAt).toLocaleString()}</td>
              <td className="px-3 py-2">{n.read ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}