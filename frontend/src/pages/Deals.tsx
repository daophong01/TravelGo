import { useEffect, useState } from 'react';
import { getFeaturedDestinations } from '../services/destination';
import Skeleton from '../components/Skeleton';
import { Link } from 'react-router-dom';

function formatCurrency(n?: number | null) {
  if (!n && n !== 0) return '-';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function Deals() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFeaturedDestinations().then(setItems).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Ưu đãi & Khuyến mãi</h1>

      {loading && (
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-sm text-gray-500">Hiện chưa có ưu đãi.</div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((d) => (
            <Link to={`/destinations/${d.slug}`} key={d.id} className="border rounded p-4 hover:shadow-sm">
              <div className="font-medium">🌴 {d.name}</div>
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">{d.description}</div>
              {'price' in d && (
                <div className="text-xs mt-2">
                  Giá từ: <span className="font-medium">{formatCurrency(d.price as any)}</span>
                </div>
              )}
              <div className="mt-2 inline-block text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">Nổi bật</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}