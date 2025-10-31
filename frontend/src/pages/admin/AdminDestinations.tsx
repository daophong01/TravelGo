import { useMemo, useState } from 'react';
import Table from '../../components/Table';
import Skeleton from '../../components/Skeleton';
import { bulkDeleteDestinations, createDestination, deleteDestination, getDestinationsPaged, updateDestination, uploadDestinationImages } from '../../services/destination';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { exportDestinationsCSV } from '../../services/admin';
import { getCategories } from '../../services/category';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  featured: z.boolean().optional(),
  price: z.coerce.number().int().nonnegative().optional(),
  categoryId: z.coerce.number().int().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AdminDestinations() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // filters
  const [q, setQ] = useState('');
  const [featured, setFeatured] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [cats, setCats] = useState<Array<{ id: number; name: string }>>([]);

  useMemo(() => {
    getCategories().then(setCats).catch(() => setCats([]));
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'destinations', page, pageSize, q, featured, categoryId, minPrice, maxPrice],
    queryFn: () => getDestinationsPaged(page, pageSize, {
      q: q || undefined,
      sort: 'featured_first',
      categoryId: categoryId || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      ...(featured ? { featured: featured === 'true' } as any : {}),
    }),
    keepPreviousData: true,
  });

  const total = data?.total || 0;
  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', slug: '', description: '', featured: false, price: 0, categoryId: undefined },
  });

  async function onCreate(values: FormData) {
    try {
      await createDestination(values);
      toast.success('Destination created');
      reset();
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create');
    }
  }

  async function onUpdate(id: number, patch: Partial<FormData>) {
    try {
      await updateDestination(id, patch);
      toast.success('Updated');
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Update failed');
    }
  }

  async function onDelete(id: number) {
    if (!confirm('Delete this destination?')) return;
    try {
      await deleteDestination(id);
      toast.success('Deleted');
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    }
  }

  async function onBulkDelete() {
    if (!selected.length) {
      toast.error('No items selected');
      return;
    }
    if (!confirm(`Delete ${selected.length} selected destinations?`)) return;
    try {
      await bulkDeleteDestinations(selected);
      toast.success('Deleted selected');
      setSelected([]);
      setSelectAll(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Bulk delete failed');
    }
  }

  async function onExport() {
    try {
      const blob = await exportDestinationsCSV({
        q: q || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        featured: featured ? featured === 'true' : undefined,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'destinations.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Export failed');
    }
  }

  function toggleSelect(id: number) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleSelectAllOnPage() {
    if (!data) return;
    const pageIds = data.items.map((d: any) => d.id);
    if (selectAll) {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
      setSelectAll(false);
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...pageIds])));
      setSelectAll(true);
    }
  }

  async function onUploadImages(id: number, files: FileList | null) {
    if (!files || files.length === 0) return;
    try {
      await uploadDestinationImages(id, Array.from(files));
      toast.success('Uploaded images');
    } catch {
      toast.error('Upload failed');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Destinations</h2>
        <div className="flex items-center gap-2">
          <button onClick={onExport} className="px-3 py-2 rounded border">Export CSV</button>
          <button
            onClick={onBulkDelete}
            className="px-3 py-2 rounded bg-red-600 text-white disabled:opacity-50"
            disabled={!selected.length}
          >
            Delete selected ({selected.length})
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-3">
        <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Search..." value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} />
        <select className="border rounded px-3 py-2" value={categoryId} onChange={(e) => { setPage(1); setCategoryId(e.target.value); }}>
          <option value="">All categories</option>
          {cats.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
        </select>
        <select className="border rounded px-3 py-2" value={featured} onChange={(e) => { setPage(1); setFeatured(e.target.value); }}>
          <option value="">All</option>
          <option value="true">Featured</option>
          <option value="false">Not featured</option>
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input className="border rounded px-3 py-2" placeholder="Min price" value={minPrice} onChange={(e) => { setPage(1); setMinPrice(e.target.value); }} />
          <input className="border rounded px-3 py-2" placeholder="Max price" value={maxPrice} onChange={(e) => { setPage(1); setMaxPrice(e.target.value); }} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onCreate)} className="grid md:grid-cols-6 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Name</label>
          <input className="border rounded px-3 py-2 w-full" {...register('name')} />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Slug</label>
          <input className="border rounded px-3 py-2 w-full" {...register('slug')} />
          {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Price</label>
          <input className="border rounded px-3 py-2 w-full" type="number" {...register('price')} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Category</label>
          <select className="border rounded px-3 py-2 w-full" {...register('categoryId')}>
            <option value="">None</option>
            {cats.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Description</label>
          <input className="border rounded px-3 py-2 w-full" {...register('description')} />
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('featured')} />
            Featured
          </label>
          <button disabled={isSubmitting} type="submit" className="px-4 py-2 rounded bg-sky-500 text-white disabled:opacity-50">
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      )}

      {!isLoading && data && data.items.length === 0 && (
        <div className="text-sm text-gray-500">No destinations.</div>
      )}

      {!isLoading && data && data.items.length > 0 && (
        <>
          <Table headers={['', 'ID', 'Name', 'Slug', 'Price', 'Category', 'Featured', 'Images', 'Actions']}>
            <tr className="border-t">
              <td className="px-3 py-2">
                <input type="checkbox" checked={selectAll} onChange={toggleSelectAllOnPage} />
              </td>
              <td className="px-3 py-2" colSpan={8}>
                <span className="text-xs text-gray-500">Select all on page</span>
              </td>
            </tr>
            {data.items.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(d.id)}
                    onChange={() => toggleSelect(d.id)}
                  />
                </td>
                <td className="px-3 py-2">{d.id}</td>
                <td className="px-3 py-2">
                  <InlineEdit value={d.name} onSave={(v) => onUpdate(d.id, { name: v })} />
                </td>
                <td className="px-3 py-2">
                  <InlineEdit value={d.slug} onSave={(v) => onUpdate(d.id, { slug: v })} />
                </td>
                <td className="px-3 py-2">
                  <InlineEdit value={String(d.price ?? 0)} onSave={(v) => onUpdate(d.id, { price: Number(v) || 0 } as any)} />
                </td>
                <td className="px-3 py-2">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={String(d.categoryId || '')}
                    onChange={(e) => onUpdate(d.id, { categoryId: e.target.value ? Number(e.target.value) : null } as any)}
                  >
                    <option value="">None</option>
                    {cats.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={!!d.featured}
                    onChange={(e) => onUpdate(d.id, { featured: e.target.checked })}
                  />
                </td>
                <td className="px-3 py-2">
                  <input type="file" multiple onChange={(e) => onUploadImages(d.id, e.target.files)} />
                </td>
                <td className="px-3 py-2">
                  <button className="text-red-600 text-sm" onClick={() => onDelete(d.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </Table>

          <div className="flex items-center gap-2 mt-3">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="text-sm">{page} / {Math.max(1, Math.ceil((data.total || 0) / pageSize))}</span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => (p < pageCount ? p + 1 : p))}
              disabled={page >= pageCount}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function InlineEdit({ value, onSave }: { value: string; onSave: (v: string) => Promise<void> | void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  return editing ? (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSave(val);
        setEditing(false);
      }}
      className="flex items-center gap-2"
    >
      <input className="border rounded px-2 py-1 text-sm" value={val} onChange={(e) => setVal(e.target.value)} />
      <button className="text-sm text-sky-600" type="submit">Save</button>
      <button className="text-sm text-gray-500" type="button" onClick={() => { setVal(value); setEditing(false); }}>Cancel</button>
    </form>
  ) : (
    <button className="text-left w-full" onClick={() => setEditing(true)}>
      {value}
    </button>
  );
}