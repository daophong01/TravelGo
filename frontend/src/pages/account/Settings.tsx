import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../../lib/auth';
import { updateSettings } from '../../services/settings';
import { useUser } from '../../hooks/useUser';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
});

type FormData = z.infer<typeof schema>;

export default function Settings() {
  const me = getCurrentUser();
  const { data } = useUser(me?.id);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: { name: data?.name || '' },
  });

  async function onSubmit(values: FormData) {
    if (!me) return;
    try {
      await updateSettings(me.id, { name: values.name });
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
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded bg-sky-500 text-white disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}