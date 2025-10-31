import { Link, Outlet } from 'react-router-dom';

export default function AccountLayout() {
  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="border-r p-4 space-y-2">
        <h2 className="font-semibold mb-2">My Account</h2>
        <nav className="grid gap-2 text-sm">
          <Link to="/account/profile">Profile</Link>
          <Link to="/account/bookings">Bookings</Link>
          <Link to="/account/payments">Payments</Link>
          <Link to="/account/wishlist">Wishlist</Link>
          <Link to="/account/reviews">Reviews</Link>
          <Link to="/account/notifications">Notifications</Link>
          <Link to="/account/loyalty">Loyalty Points</Link>
          <Link to="/account/support">Support</Link>
          <Link to="/account/settings">Settings</Link>
          <Link to="/account/password">Change Password</Link>
          <Link to="/account/security">Security</Link>
        </nav>
        <div className="pt-4">
          <Link to="/" className="text-xs text-gray-500">&larr; Back to Home</Link>
        </div>
      </aside>
      <div>
        <header className="border-b p-4">
          <h1 className="font-semibold">Account Area</h1>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}