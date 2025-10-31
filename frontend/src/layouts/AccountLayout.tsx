import { Link, Outlet } from 'react-router-dom';

export default function AccountLayout() {
  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="border-r p-4 space-y-2">
        <h2 className="font-semibold mb-2">Tài khoản của tôi</h2>
        <nav className="grid gap-2 text-sm">
          <Link to="/account/profile">Hồ sơ</Link>
          <Link to="/account/bookings">Đơn đặt</Link>
          <Link to="/account/payments">Thanh toán</Link>
          <Link to="/account/wishlist">Yêu thích</Link>
          <Link to="/account/reviews">Đánh giá</Link>
          <Link to="/account/notifications">Thông báo</Link>
          <Link to="/account/loyalty">Điểm thưởng</Link>
          <Link to="/account/support">Hỗ trợ</Link>
          <Link to="/account/settings">Cài đặt</Link>
          <Link to="/account/password">Đổi mật khẩu</Link>
          <Link to="/account/security">Bảo mật</Link>
        </nav>
        <div className="pt-4">
          <Link to="/" className="text-xs text-gray-500">&larr; Về trang chủ</Link>
        </div>
      </aside>
      <div>
        <header className="border-b p-4">
          <h1 className="font-semibold">Khu vực tài khoản</h1>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}