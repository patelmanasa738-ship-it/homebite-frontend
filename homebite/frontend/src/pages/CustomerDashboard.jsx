import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api/client';
import { ShoppingBag, Clock, MapPin, User, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await ordersApi.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-700 font-bold text-xl flex items-center justify-center">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-stone-900">
              {user?.fullName || 'Valued Customer'}
            </h1>
            <p className="text-xs text-stone-500">{user?.email}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Verified Foodie
            </span>
          </div>
        </div>

        <Link
          to="/dishes"
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
        >
          Explore Today's Menu
        </Link>
      </div>

      {/* Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-stone-900">
            Your Order History
          </h2>
          <span className="text-xs text-stone-500 font-medium tabular-nums">
            {orders.length} Total Orders
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-stone-500">Loading your meals...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 space-y-3">
            <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="font-semibold text-stone-800 text-sm">No orders yet</p>
            <p className="text-xs text-stone-500">Treat yourself to a warm homestyle dish cooked by neighbors.</p>
            <Link
              to="/dishes"
              className="inline-block mt-2 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg"
            >
              Order Homemade Food
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-bold text-stone-900">Order #{ord.id}</span>
                    <span className="text-xs text-stone-400 mx-2">·</span>
                    <span className="text-xs text-stone-600">{ord.kitchenName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                      ord.status === 'DELIVERED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {ord.status}
                    </span>
                    <span className="text-xs text-stone-400">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-stone-700">
                  {ord.items?.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>{it.quantity}x {it.dishName}</span>
                      <span className="font-semibold tabular-nums">${Number(it.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span className="truncate max-w-xs">{ord.deliveryAddress}</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900 tabular-nums">
                    Total: <span className="text-orange-600">${Number(ord.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
