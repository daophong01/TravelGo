import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../../lib/auth';
import { updateSettings, uploadAvatar } from '../../services/settings';
import { useUser } from '../../hooks/useUser';
import { useEffect, useMemo, useRef, useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Vui lòng nhập họ tên'),
  email: z.string().email('Email không hợp lệ'),
  avatarUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export default function Settings() {
  const me = getCurrentUser();
  const { data } = useUser(me?.id);
  const [preview, setPreview] = useState<string>('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const defaultValues = useMemo<FormData>(() => ({
    name: data?.name || '',
    email: data?.email || '',
    avatarUrl: (data as any)?.avatarUrl || '',
  }), [data]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: defaultValues,
  });

  const avatarUrlVal = watch('avatarUrl');
  useEffect(() => {
    setPreview(avatarUrlVal || '');
  }, [avatarUrlVal]);

  async function onSubmit(values: FormData) {
    if (!me) return;
    try {
      await updateSettings(me.id, { name: values.name, email: values.email, avatarUrl: values.avatarUrl || undefined });
      toast.success('Đã lưu cài đặt');
      reset(values);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Lưu cài đặt thất bại');
    }
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!me) return;
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadAvatar(me.id, file);
      setValue('avatarUrl', url, { shouldValidate: true });
      toast.success('Đã tải ảnh đại diện');
      if (fileRef.current) fileRef.current.value = '';
    } catch (e) {
      toast.error('Tải ảnh thất bại');
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-3">Cài đặt</h2>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Họ và tên</label>
          <input className="border rounded px-3 py-2 w-full" {...register('name')} />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Email</label>
          <input className="border rounded px-3 py-2 w-full" {...register('email')} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Ảnh đại diện</label>
          <div className="flex items-center gap-3">
            <input ref={fileRef} type="file" accept="image/*" onChange={onPickFile} />
            {preview ? <img src={preview} alt="avatar" className="w-10 h-10 rounded-full object-cover border" /> : null}
          </div>
          <input className="border rounded px-3 py-2 w-full mt-2" placeholder="https://..." {...register('avatarUrl')} />
          {errors.avatarUrl && <p className="text-xs text-red-600 mt-1">{errors.avatarUrl.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded bg-sky-500 text-white disabled:opacity-50">
          {isSubmitting ? 'Đang lưu...' : 'Lưu'}
        </button>
      </form>
    </div>
  );
}