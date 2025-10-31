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
  const categoryIds = params.getAll('categoryIds'); // multi
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';
  const sort = params.get('sort') || 'created_desc';

  const [data, setData] = useState<{ items: any[]; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [cats, setCats] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    getCategories().then(setCats).catch(() => setCats([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const catIdsNum = categoryIds.map((v) => Number(v)).filter(Boolean);
    getDestinationsPaged(page, pageSize, {
      q: q || undefined,
      categoryId: categoryId || undefined,
      categoryIds: catIdsNum.length ? catIdsNum : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort,
    })
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [page, pageSize, q, categoryId, categoryIds.join(','), minPrice, maxPrice, sort]);

  // Compute total pages server-side result
  const pageCount = useMemo(() => Math.max(1, Math.ceil((data?.total || 0) / pageSize)), [data?.total]);

  function setFilter(next: Record<string, string | string[]>) {
    const merged = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      merged.delete(k);
      if (Array.isArray(v)) {
        v.forEach((vv) => vv && merged.append(k, vv));
      } else if (v) merged.set(k, v);
    });
    merged.set('page', '1');
    setParams(merged);
  }

  function toggleMultiCategory(id: number) {
    const current = new Set(params.getAll('categoryIds'));
    if (current.has(String(id))) current.delete(String(id));
    else current.add(String(id));
    setFilter({ categoryIds: Array.from(current) });
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
          <option value="featured_first">Featured first</option>
          <option value="created_desc">Newest</option>
          <option value="created_asc">Oldest</option>
          <option value="name_asc">Name A-Z</option>
          <option value="name_desc">Name Z-A</option>
        </select>

        <div className="md:col-span-4 grid md:grid-cols-4 gap-3">
          <div className="border rounded p-2">
            <div className="text-xs text-gray-500 mb-1">Multi-category</div>
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => {
                const active = categoryIds.includes(String(c.id));
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`px-2 py-1 rounded text-sm border ${active ? 'bg-sky-500 text-white border-sky-500' : ''}`}
                    onClick={() => toggleMultiCategory(c.id)}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Min price</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={minPrice}
              onChange={(e) => setFilter({ minPrice: e.target.value })}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Max price</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={maxPrice}
              onChange={(e) => setFilter({ maxPrice: e.target.value })}
              placeholder="20000000"
            />
          </div>
        </div>
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
              <div className="font-medium">🌴 {d.name} {d.featured ? <span className="text-xs text-amber-600 ml-1">★</span> : null}</div>
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">{d.description}</div>
              {'price' in d && d.price ? <div className="text-xs mt-2 font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.price)}</div> : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}