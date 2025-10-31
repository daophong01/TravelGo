import { useParams } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Đặt lại mật khẩu</h1>
      <p className="text-xs text-gray-500 mb-4">Token: {token}</p>
      <form className="grid gap-3">
        <input className="border rounded px-3 py-2" placeholder="Mật khẩu mới" type="password" />
        <button type="button" className="px-4 py-2 rounded bg-sky-500 text-white">Cập nhật mật khẩu</button>
      </form>
    </div>
  );
}