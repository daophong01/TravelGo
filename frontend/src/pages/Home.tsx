import { Link } from 'react-router-dom';
import Skeleton from '../components/Skeleton';
import { useFeaturedDestinations } from '../hooks/useDestinations';

export default function Home() {
  const { data, isLoading } = useFeaturedDestinations();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <section className="text-center py-16 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Khám phá thế giới cùng TravelGo</h1>
        <p className="opacity-90">Tìm điểm đến, đặt chuyến đi và nhận ưu đãi hấp dẫn.</p>
      </section>
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-3">Điểm đến nổi bật</h2>
          <Link to="/destinations" className="text-sm">Xem tất cả</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          {!isLoading &&
            data?.map((d) => (
              <Link to={`/destinations/${d.slug}`} key={d.id} className="border rounded p-4 hover:shadow-sm">
                <div className="font-medium">🌴 {d.name}</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{d.description}</div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}