import { useParams } from 'react-router-dom';

export default function DestinationDetail() {
  const { slug } = useParams();
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Destination: {slug}</h1>
      <p>Detail info, photos, map, and reviews.</p>
    </div>
  );
}