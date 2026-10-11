import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersApi } from '../api/client';
import { CheckCircle2, Clock, MapPin, Phone, ChefHat, ArrowRight } from 'lucide-react';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await ordersApi.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return <div className="max-w-md mx-auto py-20 text-center text-sm text-stone-500">Loading order receipt...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-display text-3xl font-bold text-stone-900">
          Order Confirmed!
        </h1>
        <p className="text-sm text-stone-600">
          Order #{order?.id || id} has been sent directly to the cook's kitchen.
        </p>
      </div>

      {/* Order Card Receipt */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Kitchen</span>
            <h3 className="font-semibold text-stone-900 text-base">{order?.kitchenName || "Nonna's Hearth & Pasta"}</h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Status</span>
            <div className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 mt-0.5">
              {order?.status || 'PREPARING'}
            </div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 flex items-center gap-3">
          <Clock className="w-5 h-5 text-orange-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-stone-800">Estimated Delivery Time: 35–50 Mins</p>
            <p className="text-[11px] text-stone-500">The cook will notify when the meal is packed and dispatched.</p>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="space-y-2 text-xs text-stone-600">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span>Delivering to: <strong className="text-stone-900">{order?.deliveryAddress}</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span>Customer Phone: <strong className="text-stone-900">{order?.customerPhone}</strong></span>
          </div>
        </div>

        {/* Itemized summary */}
        {order?.items && order.items.length > 0 && (
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">Itemized Receipt</h4>
            <div className="divide-y divide-stone-100 text-xs">
              {order.items.map((it) => (
                <div key={it.id} className="py-2 flex justify-between">
                  <span>{it.quantity}x {it.dishName}</span>
                  <span className="font-semibold tabular-nums text-stone-900">${Number(it.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-between text-sm font-bold text-stone-900">
              <span>Total Amount</span>
              <span className="tabular-nums text-orange-600">${Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link
            to="/dashboard"
            className="flex-1 py-3 text-center bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            View in My Orders
          </Link>
          <Link
            to="/dishes"
            className="flex-1 py-3 text-center border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
          >
            Browse More Dishes
          </Link>
        </div>
      </div>
    </div>
  );
}
