import { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useToastStore from './store/toastStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Removed conflicting ToastContainer import

// Lazy load pages
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
// TODO: Vendor/Admin pages - commented out
// const VendorDashboard = lazy(() => import('./pages/vendor/VendorDashboard'));
// ... other missing pages

function ProtectedRoute({ children, roles = null }) {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function LoginRegisterGuard({ children }) {
  const { user } = useAuthStore();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function LocalToastContainer() {
  const { toasts, removeToast } = useToastStore();
  return (
    <div className="fixed top-4 right-4 space-y-2 z-[1000]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={`p-4 rounded-lg shadow-lg max-w-sm fade-in duration-300
            ${toast.type === 'success' ? 'bg-green-500 text-white border-green-600' : ''}
            ${toast.type === 'error' ? 'bg-red-500 text-white border-red-600' : ''}
            ${toast.type === 'info' ? 'bg-blue-500 text-white border-blue-600' : ''}
          `}
          onClick={() => removeToast(toast.id)}
        >
{toast.message}
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          {/* Missing pages commented */}
          {/* <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } /> 
          ... other protected routes commented until pages created */}
          
          {/* Vendor/Admin routes commented - pages missing 
          <Route path="/vendor/dashboard" element={
            <ProtectedRoute roles={['VENDOR']}>
              <VendorDashboard />
            </ProtectedRoute>
          } />
           ... admin routes commented */}
          <Route path="/login" element={
            <LoginRegisterGuard>
              <LoginPage />
            </LoginRegisterGuard>
          } />
          <Route path="/register" element={
            <LoginRegisterGuard>
              <RegisterPage />
            </LoginRegisterGuard>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
          </Suspense>
        </ErrorBoundary>
      <LocalToastContainer />
      <Footer />
    </BrowserRouter>
  );
}

export default App;

