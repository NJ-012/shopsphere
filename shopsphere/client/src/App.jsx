import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useToastStore from './store/toastStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

import CustomCursor from './components/ui/CustomCursor';
import PageTransition from './components/ui/PageTransition';
import { AnimatePresence } from 'framer-motion';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const VirtualStudioPage = lazy(() => import('./pages/VirtualStudioPage'));
const SavedLooksPage = lazy(() => import('./pages/SavedLooksPage'));

function ProtectedRoute({ children, roles = null }) {
  const { user, isHydrated } = useAuthStore();

  if (!isHydrated) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

function LoginRegisterGuard({ children }) {
  const { user, isHydrated } = useAuthStore();
  if (!isHydrated) return <LoadingSpinner />;
  return user ? <Navigate to="/" replace /> : children;
}

function LocalToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[1000] space-y-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => removeToast(toast.id)}
          className={`pointer-events-auto block w-full max-w-sm rounded-2xl border px-4 py-3 text-left shadow-xl transition ${
            toast.type === 'success'
              ? 'border-emerald-300 bg-emerald-500 text-white'
              : toast.type === 'error'
                ? 'border-rose-300 bg-rose-500 text-white'
                : 'border-sky-300 bg-sky-500 text-white'
          }`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}

function AppShell() {
  const { user, fetchCurrentUser, isHydrated } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (isHydrated && user) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser, isHydrated, user]);

  return (
    <>
      <CustomCursor />
      <Navbar />
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
              <Route path="/shop" element={<PageTransition><ShopPage /></PageTransition>} />
              <Route path="/product/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
              <Route path="/cart" element={<ProtectedRoute><PageTransition><CartPage /></PageTransition></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><PageTransition><CheckoutPage /></PageTransition></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><PageTransition><OrderHistoryPage /></PageTransition></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><PageTransition><OrderDetailPage /></PageTransition></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><PageTransition><WishlistPage /></PageTransition></ProtectedRoute>} />
              <Route path="/studio" element={<ProtectedRoute><PageTransition><VirtualStudioPage /></PageTransition></ProtectedRoute>} />
              <Route path="/my-looks" element={<ProtectedRoute><PageTransition><SavedLooksPage /></PageTransition></ProtectedRoute>} />
              <Route path="/login" element={<LoginRegisterGuard><PageTransition><LoginPage /></PageTransition></LoginRegisterGuard>} />
              <Route path="/register" element={<LoginRegisterGuard><PageTransition><RegisterPage /></PageTransition></LoginRegisterGuard>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </ErrorBoundary>
      <LocalToastContainer />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
