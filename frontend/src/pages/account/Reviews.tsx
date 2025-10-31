import Skeleton from '../../components/Skeleton';
import Table from '../../components/Table';
import { getCurrentUser } from '../../lib/auth';
import { useQuery } from '@tanstack/react-query';
import { getUserReviews } from '../../services/review';

export default function Reviews() {
  const me = getCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ['reviews', me?.id],
    queryFn: () => getUserReviews(me!.id),
    enabled: !!me?.id,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">My Reviews</h2>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
        </div>
      )}

      {!isLoading && (!data || data.length === 0) && (
        <div className="text-sm text-gray-500">You haven't written any reviews yet.</div>
      )}

      {!isLoading && data && data.length > 0 && (
        <Table headers={['ID', 'Destination ID', 'Rating', 'Comment']}>
          {data.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="px-3 py-2">{r.id}</td>
              <td className="px-3 py-2">{r.destinationId}</td>
              <td className="px-3 py-2">{r.rating}</td>
              <td className="px-3 py-2">{r.comment || '-'}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}