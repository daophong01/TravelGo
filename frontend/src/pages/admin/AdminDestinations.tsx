import { useMemo, useState } from 'react';
import Table from '../../components/Table';
import Skeleton from '../../components/Skeleton';
import { bulkDeleteDestinations, createDestination, deleteDestination, getDestinationsPaged, updateDestination, uploadDestinationImages, getDestinationImages, deleteDestinationImage } from '../../services/destination';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { exportDestinationsCSV } from '../../services/admin';
import { getCategories } from '../../services/category';

const schema = z.object({
  name: z.string().min(2, 'Tên là bắt buộc'),
  slug: z.string().min(2, 'Slug là bắt buộc'),
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

  // image management
  const [openImagesId, setOpenImagesId] = useState<number | null>(null);
  const [images, setImages] = useState<Record<number, Array<{ id: number; url: string }>>>({});
  const [loadingImages, setLoadingImages] = useState<number | null>(null);

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
      toast.success('Đã tạo điểm đến');
      reset();
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Tạo thất bại');
    }
  }

  async function onUpdate(id: number, patch: Partial<FormData>) {
    try {
      await updateDestination(id, patch);
      toast.success('Đã cập nhật');
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Cập nhật thất bại');
    }
  }

  async function onDelete(id: number) {
    if (!confirm('Xóa điểm đến này?')) return;
    try {
      await deleteDestination(id);
      toast.success('Đã xóa');
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Xóa thất bại');
    }
  }

  async function onBulkDelete() {
    if (!selected.length) {
      toast.error('Chưa chọn mục nào');
      return;
    }
    if (!confirm(`Xóa ${selected.length} điểm đến đã chọn?`)) return;
    try {
      await bulkDeleteDestinations(selected);
      toast.success('Đã xóa các mục đã chọn');
      setSelected([]);
      setSelectAll(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Xóa hàng loạt thất bại');
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
      toast.error('Xuất CSV thất bại');
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
      toast.success('Đã tải ảnh');
      await loadImages(id);
    } catch {
      toast.error('Tải ảnh thất bại');
    }
  }

  async function loadImages(id: number) {
    try {
      setLoadingImages(id);
      const list = await getDestinationImages(id);
      setImages((prev) => ({ ...prev, [id]: list }));
    } finally {
      setLoadingImages(null);
    }
  }

  async function onDeleteImage(id: number, imageId: number) {
    if (!confirm('Xóa ảnh này?')) return;
    try {
      await deleteDestinationImage(imageId);
      toast.success('Đã xóa ảnh');
      await loadImages(id);
    } catch {
      toast.error('Xóa ảnh thất bại');
    }
  }

  function toggleImages(id: number) {
    if (openImagesId === id) {
      setOpenImagesId(null);
      return;
    }
    setOpenImagesId(id);
    loadImages(id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Điểm đến</h2>
        <div className="flex items-center gap-2">
          <button onClick={onExport} className="px-3 py-2 rounded border">Xuất CSV</button>
          <button
            onClick={onBulkDelete}
            className="px-3 py-2 rounded bg-red-600 text-white disabled:opacity-50"
            disabled={!selected.length}
          >
            Xóa đã chọn ({selected.length})
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-3">
        <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Tìm kiếm..." value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} />
        <select className="border rounded px-3 py-2" value={categoryId} onChange={(e) => { setPage(1); setCategoryId(e.target.value); }}>
          <option value="">Tất cả danh mục</option>
          {cats.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
        </select>
        <select className="border rounded px-3 py-2" value={featured} onChange={(e) => { setPage(1); setFeatured(e.target.value); }}>
          <option value="">Tất cả</option>
          <option value="true">Nổi bật</option>
          <option value="false">Không nổi bật</option>
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input className="border rounded px-3 py-2" placeholder="Giá tối thiểu" value={minPrice} onChange={(e) => { setPage(1); setMinPrice(e.target.value); }} />
          <input className="border rounded px-3 py-2" placeholder="Giá tối đa" value={maxPrice} onChange={(e) => { setPage(1); setMaxPrice(e.target.value); }} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onCreate)} className="grid md:grid-cols-6 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Tên</label>
          <input className="border rounded px-3 py-2 w-full" {...register('name')} />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Slug</label>
          <input className="border rounded px-3 py-2 w-full" {...register('slug')} />
          {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Giá</label>
          <input className="border rounded px-3 py-2 w-full" type="number" {...register('price')} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Danh mục</label>
          <select className="border rounded px-3 py-2 w-full" {...register('categoryId')}>
            <option value="">Không</option>
            {cats.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Mô tả</label>
          <input className="border rounded px-3 py-2 w-full" {...register('description')} />
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('featured')} />
            Nổi bật
          </label>
          <button disabled={isSubmitting} type="submit" className="px-4 py-2 rounded bg-sky-500 text-white disabled:opacity-50">
            {isSubmitting ? 'Đang tạo...' : 'Tạo'}
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
        <div className="text-sm text-gray-500">Không có điểm đến.</div>
      )}

      {!isLoading && data && data.items.length > 0 && (
        <>
          <Table headers={['', 'Mã', 'Tên', 'Slug', 'Giá', 'Danh mục', 'Nổi bật', 'Ảnh', 'Hành động']}>
            <tr className="border-t">
              <td className="px-3 py-2">
                <input type="checkbox" checked={selectAll} onChange={toggleSelectAllOnPage} />
              </td>
              <td className="px-3 py-2" colSpan={8}>
                <span className="text-xs text-gray-500">Chọn tất cả trong trang</span>
              </td>
            </tr>
            {data.items.map((d) => (
              <tbody key={d.id}>
                <tr className="border-t">
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
                      <option value="">Không</option>
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
                    <div className="flex items-center gap-2">
                      <input type="file" multiple onChange={(e) => onUploadImages(d.id, e.target.files)} />
                      <button type="button" className="text-sm text-sky-600" onClick={() => toggleImages(d.id)}>
                        {openImagesId === d.id ? 'Ẩn ảnh' : 'Xem ảnh'}
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <button className="text-red-600 text-sm" onClick={() => onDelete(d.id)}>Xóa</button>
                  </td>
                </tr>
                {openImagesId === d.id && (
                  <tr className="border-t bg-gray-50">
                    <td className="px-3 py-2" colSpan={9}>
                      {loadingImages === d.id && <div className="text-xs text-gray-500">Đang tải ảnh...</div>}
                      {!loadingImages && Array.isArray(images[d.id]) && images[d.id].length === 0 && (
                        <div className="text-xs text-gray-500">Chưa có ảnh.</div>
                      )}
                      {!loadingImages && Array.isArray(images[d.id]) && images[d.id].length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {images[d.id].map((img) => (
                            <div key={img.id} className="relative">
                              <img src={img.url} alt="" className="h-20 w-28 object-cover rounded border" />
                              <button
                                type="button"
                                className="absolute top-1 right-1 text-xs bg-red-600 text-white px-1 rounded"
                                onClick={() => onDeleteImage(d.id, img.id)}
                              >
                                Xóa
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            ))}
          </Table>

          <div className="flex items-center gap-2 mt-3">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Trước
            </button>
            <span className="text-sm">{page} / {Math.max(1, Math.ceil((data.total || 0) / pageSize))}</span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((p) => (p < pageCount ? p + 1 : p))}
              disabled={page >= pageCount}
            >
              Sau
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
      <button className="text-sm text-sky-600" type="submit">Lưu</button>
      <button className="text-sm text-gray-500" type="button" onClick={() => { setVal(value); setEditing(false); }}>Hủy</button>
    </form>
  ) : (
    <button className="text-left w-full" onClick={() => setEditing(true)}>
      {value}
    </button>
  );
}