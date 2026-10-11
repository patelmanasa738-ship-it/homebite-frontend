import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

// Pages
import Home from './pages/Home';
import BrowseDishes from './pages/BrowseDishes';
import DishDetail from './pages/DishDetail';
import Cooks from './pages/Cooks';
import CookProfilePage from './pages/CookProfilePage';
import Login from './pages/Login';
import RegisterCustomer from './pages/RegisterCustomer';
import RegisterCook from './pages/RegisterCook';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import CustomerDashboard from './pages/CustomerDashboard';
import CookDashboard from './pages/CookDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Helpers
const ProtectedCustomer = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const ProtectedCook = ({ children }) => {
  const { isAuthenticated, isCook, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isCook && !isAdmin) return <Navigate to="/" replace />;
  return children;
};

const ProtectedAdmin = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1917] selection:bg-orange-200">
            <Navbar />
            <CartDrawer />
            
            <main className="flex-1">
              <Routes>
                {/* Public Browsing */}
                <Route path="/" element={<Home />} />
                <Route path="/dishes" element={<BrowseDishes />} />
                <Route path="/dishes/:id" element={<DishDetail />} />
                <Route path="/cooks" element={<Cooks />} />
                <Route path="/cooks/:id" element={<CookProfilePage />} />
                
                {/* Authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterCustomer />} />
                <Route path="/register/cook" element={<RegisterCook />} />
                
                {/* Cart & Checkout */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                
                {/* Customer Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedCustomer>
                      <CustomerDashboard />
                    </ProtectedCustomer>
                  }
                />

                {/* Cook Kitchen Studio Dashboard */}
                <Route
                  path="/cook/dashboard"
                  element={
                    <ProtectedCook>
                      <CookDashboard />
                    </ProtectedCook>
                  }
                />

                {/* Admin Governance Portal */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdmin>
                      <AdminDashboard />
                    </ProtectedAdmin>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
