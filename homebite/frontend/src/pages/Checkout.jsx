import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api/client';
import { MapPin, Phone, MessageSquare, ShieldCheck, ArrowRight, ArrowLeft, Truck } from 'lucide-react';

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('742 Evergreen Terrace, Springfield, IL');
  const [phone, setPhone] = useState(user?.phoneNumber || '+1 (555) 456-7890');
  const [notes, setNotes] = useState('Please leave with doorman or ring front bell.');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-stone-900">Your basket is empty</h2>
        <p className="text-xs text-stone-500">Please add dishes to your basket before checking out.</p>
        <Link to="/dishes" className="inline-block px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg">
          Browse Menu
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) {
      setErrorMsg('Please provide a complete delivery address and contact phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const order = await ordersApi.create({
        deliveryAddress: address.trim(),
        customerPhone: phone.trim(),
        specialNotes: notes.trim()
      });
      await refreshCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Basket</span>
        </Link>
        <h1 className="font-display text-3xl font-bold text-stone-900">
          Delivery & Checkout
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review your order details and delivery location.
        </p>
      </div>

      {errorMsg && (
        <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-5">
          <h2 className="font-semibold text-stone-900 text-base flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-600" />
            Delivery Details
          </h2>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Delivery Street Address
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Apartment 4B, City, State ZIP"
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Contact Phone Number
            </label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Delivery Instructions (Optional)
            </label>
            <div className="relative flex items-start">
              <MessageSquare className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Gate code, drop-off spot, or allergy reminder..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Payment Terms (Cash on Delivery or Pay at Door) */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
            <h4 className="text-xs font-bold text-amber-900">Payment on Delivery / Verified Kitchen Hand-off</h4>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Pay comfortably with card, Apple Pay, or cash when your fresh insulated meal package arrives at your door.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? 'Placing Order...' : `Confirm Order · $${Number(cart.total).toFixed(2)}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Order Review List */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="font-semibold text-stone-900 text-base">Your Order</h2>
          <p className="text-xs text-stone-500">From {cart.items[0]?.kitchenName}</p>

          <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1 space-y-2">
            {cart.items.map((item) => (
              <div key={item.id} className="pt-2 flex justify-between text-xs text-stone-700">
                <div>
                  <span className="font-semibold text-stone-900">{item.quantity}x</span> {item.dishName}
                </div>
                <span className="font-bold tabular-nums text-stone-900">${Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="tabular-nums">${Number(cart.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="tabular-nums">${Number(cart.deliveryFee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
              <span>Total Due</span>
              <span className="tabular-nums text-orange-600">${Number(cart.total).toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Guaranteed fresh and hygienic packaging</span>
          </div>
        </div>
      </div>
    </div>
  );
}
