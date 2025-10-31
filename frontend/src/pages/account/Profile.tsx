import { getCurrentUser } from '../../lib/auth';
import { useUser } from '../../hooks/useUser';
import Skeleton from '../../components/Skeleton';

export default function Profile() {
  const me = getCurrentUser();
  const { data, isLoading } = useUser(me?.id);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Profile</h2>
      {isLoading && <Skeleton className="h-20" />}
      {!isLoading && data && (
        <div className="border rounded p-4">
          <div className="text-sm"><span className="text-gray-500">Name:</span> {data.name}</div>
          <div className="text-sm"><span className="text-gray-500">Email:</span> {data.email}</div>
          <div className="text-sm"><span className="text-gray-500">Role:</span> {data.role}</div>
        </div>
      )}
    </div>
  );
}