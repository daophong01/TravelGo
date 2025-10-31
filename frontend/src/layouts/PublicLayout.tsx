import { Link, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold text-xl">TravelGo</Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/destinations">Destinations</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/deals">Deals</Link>
            <Link to="/stories">Stories</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/signin" className="px-3 py-1 rounded bg-sky-500 text-white">Sign In</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} TravelGo
        </div>
      </footer>
    </div>
  );
}