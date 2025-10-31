import { Link, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold text-xl">TravelGo</Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/destinations">Điểm đến</Link>
            <Link to="/categories">Danh mục</Link>
            <Link to="/deals">Ưu đãi</Link>
            <Link to="/stories">Câu chuyện</Link>
            <Link to="/about">Giới thiệu</Link>
            <Link to="/contact">Liên hệ</Link>
            <Link to="/signin" className="px-3 py-1 rounded bg-sky-500 text-white">Đăng nhập</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} TravelGo · Tất cả các quyền được bảo lưu
        </div>
      </footer>
    </div>
  );
}