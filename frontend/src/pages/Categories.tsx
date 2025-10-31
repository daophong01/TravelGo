import { useEffect, useState } from 'react';
import { getCategories } from '../services/category';
import { Link } from 'react-router-dom';
import Skeleton from '../components/Skeleton';

export default function Categories() {
  const [cats, setCats] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCategories().then(setCats).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Danh mục</h1>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
        </div>
      )}

      {!loading && cats.length === 0 && (
        <div className="text-sm text-gray-500">Chưa có danh mục.</div>
      )}

      {!loading && cats.length > 0 && (
        <ul className="grid md:grid-cols-2 gap-3">
          {cats.map((c) => (
            <li key={c.id} className="border rounded p-4 hover:shadow-sm">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-500 mt-1">Khám phá các điểm đến thuộc danh mục này.</div>
              <Link
                to={`/destinations?categoryId=${c.id}&page=1`}
                className="inline-block mt-2 text-sm text-sky-600"
              >
                Xem điểm đến
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}