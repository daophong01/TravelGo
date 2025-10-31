import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLogin } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [email, setEmail] = useState('admin@travelgo.dev');
  const [password, setPassword] = useState('admin123');
  const loginMutation = useLogin();
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({ email, password });
      toast.success('Đăng nhập thành công');
      navigate('/account/profile');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Đăng nhập thất bại');
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Đăng nhập</h1>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <input
          className="border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={loginMutation.isPending}
          type="submit"
          className="px-4 py-2 rounded bg-sky-500 text-white disabled:opacity-50"
        >
          {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}