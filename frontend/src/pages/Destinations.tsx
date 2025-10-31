import { Link, useSearchParams } from 'react-router-dom';
import Skeleton from '../components/Skeleton';
import Pagination from '../components/Pagination';
import { useEffect, useMemo, useState } from 'react';
import { getDestinationsPaged } from '../services/destination';
import { getCategories } from '../services/category';

export default function Destinations() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page') || 1);
  const pageSize = 9;
  const q = params.get('q') || '';
  const categoryId = params.get('categoryId') || '';
  const sort = params.get('sort') || 'created_desc';

  const [data, setData] = useState<{ items: any[]; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [cats, setCats] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    getCategories().then(setCats).catch(() => setCats([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    getDestinationsPaged(page, pageSize)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [page, pageSize, q, categoryId, sort]);

  // Compute total pages server-side result
  const pageCount = useMemo(() => Math.max(1, Math.ceil((data?.total || 0) / pageSize)), [data?.total]);

  function setFilter(next: Record<string, string>) {
    const merged = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      if (v) merged.set(k, v);
      else merged.delete(k);
    });
    merged.set('page', '1');
    setParams(merged);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold mb-4">Destinations</h1>
        <Pagination
          page={page}
          pageCount={pageCount}
          onChange={(p) => setParams({ ...Object.fromEntries(params), page: String(p) } as any)}
        />
      </div>

      <div className="grid md:grid-cols-4 gap-3 mb-4">
        <input
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="Search destinations..."
          value={q}
          onChange={(e) => setFilter({ q: e.target.value })}
        />
        <select
          className="border rounded px-3 py-2"
          value={categoryId}
          onChange={(e) => setFilter({ categoryId: e.target.value })}
        >
          <option value="">All categories</option>
          {cats.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={sort}
          onChange={(e) => setFilter({ sort: e.target.value })}
        >
          <option value="created_desc">Newest</option>
          <option value="created_asc">Oldest</option>
          <option value="name_asc">Name A-Z</option>
          <option value="name_desc">Name Z-A</option>
        </select>
      </div>

      {loading && (
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      )}

      {!loading && data && data.items.length === 0 && (
        <div className="text-sm text-gray-500">No destinations found.</div>
      )}

      {!loading && data && data.items.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {data.items.map((d) => (
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