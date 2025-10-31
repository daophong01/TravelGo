import Skeleton from '../../components/Skeleton';
import Table from '../../components/Table';
import { getCurrentUser } from '../../lib/auth';
import { useQuery } from '@tanstack/react-query';
import { getUserWishlist } from '../../services/wishlist';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const me = getCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ['wishlist', me?.id],
    queryFn: () => getUserWishlist(me!.id),
    enabled: !!me?.id,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Wishlist</h2>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
        </div>
      )}

      {!isLoading && (!data || data.length === 0) && (
        <div className="text-sm text-gray-500">Your wishlist is empty.</div>
      )}

      {!isLoading && data && data.length > 0 && (
        <Table headers={['ID', 'Destination', 'Created At']}>
          {data.map((w) => (
            <tr key={w.id} className="border-t">
              <td className="px-3 py-2">{w.id}</td>
              <td className="px-3 py-2">
                <Link to={`/destinations/${w.destination.slug}`} className="text-sky-600">
                  {w.destination.name}
                </Link>
              </td>
              <td className="px-3 py-2">{new Date(w.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}