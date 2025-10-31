import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../../lib/auth';
import { changePassword } from '../../services/settings';

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});

type FormData = z.infer<typeof schema>;

export default function ChangePassword() {
  const me = getCurrentUser();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormData) {
    if (!me) return;
    try {
      await changePassword(me.id, values.password);
      toast.success('Password updated');
      reset();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to update password');
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-3">Change Password</h2>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-xs text-gray-500 mb-1">New password</label>
          <input type="password" className="border rounded px-3 py-2 w-full" {...register('password')} />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Confirm password</label>
          <input type="password" className="border rounded px-3 py-2 w-full" {...register('confirm')} />
          {errors.confirm && <p className="text-xs text-red-600 mt-1">{errors.confirm.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded bg-sky-500 text-white disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}