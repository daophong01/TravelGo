import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="border-r p-4 space-y-2">
        <h2 className="font-semibold mb-2">Bảng quản trị</h2>
        <nav className="grid gap-2 text-sm">
          <Link to="/admin/dashboard">Tổng quan</Link>
          <Link to="/admin/users">Người dùng</Link>
          <Link to="/admin/destinations">Điểm đến</Link>
          <Link to="/admin/bookings">Đơn đặt</Link>
          <Link to="/admin/reviews">Đánh giá</Link>
          <Link to="/admin/payments">Thanh toán</Link>
          <Link to="/admin/settings">Cài đặt</Link>
        </nav>
        <div className="pt-4">
          <Link to="/" className="text-xs text-gray-500">&larr; Về website</Link>
        </div>
      </aside>
      <div>
        <header className="border-b p-4">
          <h1 className="font-semibold">Quản trị</h1>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}