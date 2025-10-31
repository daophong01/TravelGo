import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AccountLayout from './layouts/AccountLayout';
import AdminLayout from './layouts/AdminLayout';

// Public pages
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Categories from './pages/Categories';
import Deals from './pages/Deals';
import Stories from './pages/Stories';
import StoryDetail from './pages/StoryDetail';
import Contact from './pages/Contact';
import About from './pages/About';

// Auth pages
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AuthCallback from './pages/auth/AuthCallback';
import AuthSuccess from './pages/auth/AuthSuccess';
import AuthError from './pages/auth/AuthError';

// Account pages
import Profile from './pages/account/Profile';
import Bookings from './pages/account/Bookings';
import Payments from './pages/account/Payments';
import Wishlist from './pages/account/Wishlist';
import Reviews from './pages/account/Reviews';
import Notifications from './pages/account/Notifications';
import Loyalty from './pages/account/Loyalty';
import Support from './pages/account/Support';
import Settings from './pages/account/Settings';
import ChangePassword from './pages/account/ChangePassword';
import Security from './pages/account/Security';

// Checkout pages
import Checkout from './pages/checkout/Checkout';
import Payment from './pages/checkout/Payment';
import CheckoutSuccess from './pages/checkout/CheckoutSuccess';
import CheckoutFail from './pages/checkout/CheckoutFail';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDestinations from './pages/admin/AdminDestinations';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReviews from './pages/admin/AdminReviews';
import AdminPayments from './pages/admin/AdminPayments';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  // Note: Auth protection and role guards should wrap the below where appropriate.
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:slug" element={<DestinationDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories/:slug" element={<StoryDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* Auth */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/auth/callback/:provider" element={<AuthCallback />} />
      <Route path="/auth/success" element={<AuthSuccess />} />
      <Route path="/auth/error" element={<AuthError />} />

      {/* Account */}
      <Route path="/account" element={<AccountLayout />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<Profile />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="payments" element={<Payments />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="loyalty" element={<Loyalty />} />
        <Route path="support" element={<Support />} />
        <Route path="settings" element={<Settings />} />
        <Route path="password" element={<ChangePassword />} />
        <Route path="security" element={<Security />} />
      </Route>

      {/* Checkout */}
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/payment" element={<Payment />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/checkout/fail" element={<CheckoutFail />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="destinations" element={<AdminDestinations />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div className="p-8">Not Found</div>} />
    </Routes>
  );
}