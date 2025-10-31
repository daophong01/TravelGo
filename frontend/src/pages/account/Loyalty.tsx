import Skeleton from '../../components/Skeleton';
import { getCurrentUser } from '../../lib/auth';
import { useQuery } from '@tanstack/react-query';
import { getUserLoyalty } from '../../services/loyalty';

export default function Loyalty() {
  const me = getCurrentUser();
  const { data, isLoading } = useQuery({
    queryKey: ['loyalty', me?.id],
    queryFn: () => getUserLoyalty(me!.id),
    enabled: !!me?.id,
  });

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Điểm thưởng</h2>
      {isLoading && <Skeleton className="h-16" />}
      {!isLoading && (
        <div className="border rounded p-4">
          <div className="text-sm text-gray-500">Điểm của bạn</div>
          <div className="text-2xl font-semibold">{data?.points ?? 0}</div>
        </div>
      )}
    </div>
  );
}