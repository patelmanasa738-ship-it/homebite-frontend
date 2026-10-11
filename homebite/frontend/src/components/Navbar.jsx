import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User as UserIcon, LogOut, ChefHat, Shield, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, isCook, isAdmin } = useAuth();
  const { cart, setIsDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Wordmark Brand */}
        <Link to="/" className="text-2xl font-bold tracking-tight text-stone-900 font-display whitespace-nowrap shrink-0 hover:text-orange-600 transition-colors">
          HomeBite
        </Link>

        {/* Zone 2: 4-5 single-line clean nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
          <Link to="/dishes" className="hover:text-orange-600 transition-colors whitespace-nowrap shrink-0">
            Explore Dishes
          </Link>
          <Link to="/cooks" className="hover:text-orange-600 transition-colors whitespace-nowrap shrink-0">
            Local Cooks
          </Link>
          {isCook && (
            <Link to="/cook/dashboard" className="text-orange-700 hover:text-orange-800 font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <ChefHat className="w-4 h-4" />
              Kitchen Studio
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-purple-700 hover:text-purple-800 font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Admin Portal
            </Link>
          )}
          {isAuthenticated && !isCook && !isAdmin && (
            <Link to="/dashboard" className="hover:text-orange-600 transition-colors whitespace-nowrap shrink-0">
              My Orders
            </Link>
          )}
          {!isAuthenticated && (
            <Link to="/register/cook" className="text-orange-700 hover:text-orange-800 transition-colors whitespace-nowrap shrink-0">
              Cook With Us
            </Link>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Cart Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative p-2.5 rounded-full hover:bg-stone-200/60 text-stone-800 transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums">
                {cart.totalItems}
              </span>
            )}
          </button>

          {/* User auth state */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to={isCook ? "/cook/dashboard" : isAdmin ? "/admin" : "/dashboard"}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-800 hover:border-orange-500 hover:bg-white transition-all whitespace-nowrap"
              >
                <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                <span className="max-w-[120px] truncate">{user.fullName || user.email}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-2 text-stone-500 hover:text-stone-900 transition-colors rounded-lg hover:bg-stone-200/50"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 px-3 py-2 whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 shadow-sm transition-colors whitespace-nowrap"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-3 text-sm font-medium">
          <Link
            to="/dishes"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 hover:text-orange-600"
          >
            Explore Dishes
          </Link>
          <Link
            to="/cooks"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 hover:text-orange-600"
          >
            Local Cooks
          </Link>
          {isAuthenticated ? (
            <>
              {isCook && (
                <Link
                  to="/cook/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-orange-700 font-semibold"
                >
                  Cook Kitchen Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-purple-700 font-semibold"
                >
                  Admin Portal
                </Link>
              )}
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-stone-800"
              >
                Customer Orders & Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register/cook"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-orange-700 font-semibold"
              >
                Become a Home Cook
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-stone-800"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
