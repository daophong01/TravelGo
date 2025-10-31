import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="border-r p-4 space-y-2">
        <h2 className="font-semibold mb-2">Admin Panel</h2>
        <nav className="grid gap-2 text-sm">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/destinations">Destinations</Link>
          <Link to="/admin/bookings">Bookings</Link>
          <Link to="/admin/reviews">Reviews</Link>
          <Link to="/admin/payments">Payments</Link>
          <Link to="/admin/settings">Settings</Link>
        </nav>
        <div className="pt-4">
          <Link to="/" className="text-xs text-gray-500">&larr; Back to Site</Link>
        </div>
      </aside>
      <div>
        <header className="border-b p-4">
          <h1 className="font-semibold">Admin</h1>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}