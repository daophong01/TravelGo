import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../../lib/auth';
import { updateSettings } from '../../services/settings';
import { useUser } from '../../hooks/useUser';
import { useEffect, useMemo, useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  avatarUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export default function Settings() {
  const me = getCurrentUser();
  const { data } = useUser(me?.id);
  const [preview, setPreview] = useState<string>('');

  const defaultValues = useMemo<FormData>(() => ({
    name: data?.name || '',
    email: data?.email || '',
    avatarUrl: (data as any)?.avatarUrl || '',
  }), [data]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<FormData>({
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
      toast.success('Settings saved');
      reset(values);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to save settings');
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-3">Settings</h2>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Full name</label>
          <input className="border rounded px-3 py-2 w-full" {...register('name')} />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Email</label>
          <input className="border rounded px-3 py-2 w-full" {...register('email')} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Avatar URL</label>
          <input className="border rounded px-3 py-2 w-full" placeholder="https://..." {...register('avatarUrl')} />
          {errors.avatarUrl && <p className="text-xs text-red-600 mt-1">{errors.avatarUrl.message}</p>}
          {preview ? (
            <div className="mt-2 flex items-center gap-3">
              <img src={preview} alt="avatar preview" className="w-12 h-12 rounded-full object-cover border" />
              <span className="text-xs text-gray-500">Preview</span>
            </div>
          ) : null}
        </div>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded bg-sky-500 text-white disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}