import { Link, useSearchParams } from 'react-router-dom';
import { useDestinations } from '../hooks/useDestinations';
import Skeleton from '../components/Skeleton';
import Pagination from '../components/Pagination';

export default function Destinations() {
  const { data, isLoading } = useDestinations();
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page') || 1);
  const pageSize = 9;

  const total = data?.length || 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = (data || []).slice(start, start + pageSize);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold mb-4">Destinations</h1>
        <Pagination
          page={page}
          pageCount={pageCount}
          onChange={(p) => setParams({ page: String(p) })}
        />
      </div>

      {isLoading && (
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="text-sm text-gray-500">No destinations found.</div>
      )}

      {!isLoading && items.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((d) => (
            <Link to={`/destinations/${d.slug}`} key={d.id} className="border rounded p-4 hover:shadow-sm">
              <div className="font-medium">🌴 {d.name}</div>
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">{d.description}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}