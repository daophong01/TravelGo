import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Skeleton from '../components/Skeleton';
import { getDestinationBySlug, getDestinationImages } from '../services/destination';
import { getReviewsByDestination } from '../services/review';

export default function DestinationDetail() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [dest, setDest] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [images, setImages] = useState<Array<{ id: number; url: string }>>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const d = await getDestinationBySlug(slug || '');
        if (!mounted) return;
        setDest(d);
        const [r, imgs] = await Promise.all([
          getReviewsByDestination(d.id),
          getDestinationImages(d.id),
        ]);
        if (!mounted) return;
        setReviews(r);
        setImages(imgs);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {loading && <Skeleton className="h-24" />}
      {!loading && dest && (
        <>
          <h1 className="text-2xl font-semibold mb-2">{dest.name}</h1>
          <p className="text-sm text-gray-600 mb-4">{dest.description}</p>
          {'price' in dest && dest.price ? (
            <div className="text-sm font-medium mb-4">
              Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dest.price)}
            </div>
          ) : null}
          <div className="border rounded p-4 mb-6">
            <div className="text-sm text-gray-500 mb-2">Thư viện ảnh</div>
            {images.length === 0 && <div className="text-xs text-gray-500">Chưa có ảnh.</div>}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img) => (
                  <img key={img.id} src={img.url} alt="" className="h-24 w-full object-cover rounded border" />
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Đánh giá</h2>
            {reviews.length === 0 && (
              <div className="text-sm text-gray-500">Chưa có đánh giá.</div>
            )}
            {reviews.length > 0 && (
              <ul className="space-y-3">
                {reviews.map((r) => (
                  <li key={r.id} className="border rounded p-3">
                    <div className="text-sm font-medium">Điểm: {r.rating}/5</div>
                    {r.comment ? <div className="text-sm mt-1">{r.comment}</div> : null}
                    <div className="text-xs text-gray-500 mt-1">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}