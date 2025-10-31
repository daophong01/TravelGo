import Table from '../../components/Table';
import Skeleton from '../../components/Skeleton';
import { useAdminUsers } from '../../hooks/useAdmin';

export default function AdminUsers() {
  const { data, isLoading } = useAdminUsers();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Users</h2>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      )}

      {!isLoading && data && (
        <Table headers={['ID', 'Email', 'Name', 'Role']}>
          {data.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="px-3 py-2">{u.id}</td>
              <td className="px-3 py-2">{u.email}</td>
              <td className="px-3 py-2">{u.name || '-'}</td>
              <td className="px-3 py-2">{(u as any).role || '-'}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}