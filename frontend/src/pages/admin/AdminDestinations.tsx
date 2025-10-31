import { useState } from 'react';
import Table from '../../components/Table';
import Skeleton from '../../components/Skeleton';
import { useDestinations } from '../../hooks/useDestinations';
import { createDestination } from '../../services/destination';
import toast from 'react-hot-toast';

export default function AdminDestinations() {
  const { data, isLoading, refetch } = useDestinations();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!name || !slug) {
        toast.error('Name and slug are required');
        return;
      }
      await createDestination({ name, slug, description, featured });
      toast.success('Destination created');
      setName(''); setSlug(''); setDescription(''); setFeatured(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create');
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Destinations</h2>

      <form onSubmit={onCreate} className="grid md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Name</label>
          <input className="border rounded px-3 py-2 w-full" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Slug</label>
          <input className="border rounded px-3 py-2 w-full" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Description</label>
          <input className="border rounded px-3 py-2 w-full" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured
          </label>
          <button type="submit" className="px-4 py-2 rounded bg-sky-500 text-white">Create</button>
        </div>
      </form>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      )}

      {!isLoading && data && (
        <Table headers={['ID', 'Name', 'Slug', 'Featured']}>
          {data.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="px-3 py-2">{d.id}</td>
              <td className="px-3 py-2">{d.name}</td>
              <td className="px-3 py-2">{d.slug}</td>
              <td className="px-3 py-2">{d.featured ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}