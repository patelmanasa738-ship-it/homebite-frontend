import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChefHat, User, Shield, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const user = await login({ email, password });
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'COOK') {
        navigate('/cook/dashboard');
      } else {
        navigate(from === '/login' ? '/dishes' : from);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (testEmail, testPass) => {
    setEmail(testEmail);
    setPassword(testPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <h1 className="font-display text-2xl font-bold text-stone-900">
            Welcome Back to HomeBite
          </h1>
          <p className="text-xs text-stone-500">
            Sign in to savor homemade meals or manage your kitchen
          </p>
        </div>

        {errorMsg && (
          <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Quick Demo Fill Buttons for Fast Testing */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 space-y-2">
          <p className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
            Quick Fill Demo Accounts:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('emily@homebite.com', 'Customer@123')}
              className="py-1.5 px-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[11px] font-medium text-stone-700 flex items-center justify-center gap-1 transition-colors"
            >
              <User className="w-3 h-3 text-emerald-600" />
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('maria@homebite.com', 'Cook@123')}
              className="py-1.5 px-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[11px] font-medium text-stone-700 flex items-center justify-center gap-1 transition-colors"
            >
              <ChefHat className="w-3 h-3 text-orange-600" />
              Cook
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@homebite.com', 'Admin@123')}
              className="py-1.5 px-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[11px] font-medium text-stone-700 flex items-center justify-center gap-1 transition-colors"
            >
              <Shield className="w-3 h-3 text-purple-600" />
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-stone-900 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100 space-y-1">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-orange-600 hover:underline">
              Register as Customer
            </Link>
          </p>
          <p>
            Want to sell food?{' '}
            <Link to="/register/cook" className="font-semibold text-orange-600 hover:underline">
              Register as Home Cook
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
