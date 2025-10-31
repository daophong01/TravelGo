import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useRegister } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(2, 'Vui lòng nhập họ tên'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const { register: reg, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const registerMutation = useRegister();
  const navigate = useNavigate();

  async function onSubmit(values: FormData) {
    try {
      await registerMutation.mutateAsync(values);
      toast.success('Tạo tài khoản thành công');
      navigate('/account/profile');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Tạo tài khoản thất bại');
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Đăng ký</h1>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input className="border rounded px-3 py-2 w-full" placeholder="Họ và tên" {...reg('name')} />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <input className="border rounded px-3 py-2 w-full" placeholder="Email" {...reg('email')} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input className="border rounded px-3 py-2 w-full" placeholder="Mật khẩu" type="password" {...reg('password')} />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || registerMutation.isPending}
          className="px-4 py-2 rounded bg-sky-500 text-white disabled:opacity-50"
        >
          {isSubmitting || registerMutation.isPending ? 'Đang tạo...' : 'Tạo tài khoản'}
        </button>
      </form>
    </div>
  );
}