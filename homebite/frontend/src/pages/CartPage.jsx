import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-stone-900">Your Basket is Empty</h2>
        <p className="text-sm text-stone-500 max-w-sm mx-auto">
          Explore delicious homemade dishes prepared by talented local cooks in your neighborhood.
        </p>
        <Link
          to="/dishes"
          className="inline-block px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          Browse Dishes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link to="/dishes" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
        <h1 className="font-display text-3xl font-bold text-stone-900">
          Shopping Basket
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          From kitchen: <span className="font-semibold text-stone-800">{cart.items[0]?.kitchenName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-3">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs flex gap-4 items-center"
            >
              <img
                src={item.imageUrl || '/src/assets/images/hero_home_cooking_1791702710190.jpg'}
                alt={item.dishName}
                className="w-20 h-20 rounded-xl object-cover bg-stone-100 shrink-0"
                referrerPolicy="no-referrer"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-base text-stone-900 truncate">
                    {item.dishName}
                  </h3>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-stone-500 mt-0.5">
                  ${Number(item.unitPrice).toFixed(2)} each
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-stone-600 hover:text-stone-900"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold tabular-nums text-stone-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-stone-600 hover:text-stone-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-base font-bold text-stone-900 tabular-nums">
                    ${Number(item.subtotal).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Module */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="font-semibold text-stone-900 text-base">Order Summary</h2>

          <div className="space-y-2 text-xs text-stone-600 border-b border-stone-100 pb-4">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold tabular-nums text-stone-900">${Number(cart.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Neighborhood Delivery</span>
              <span className="font-semibold tabular-nums text-stone-900">${Number(cart.deliveryFee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
              <span>Estimated Total</span>
              <span className="tabular-nums text-orange-600">${Number(cart.total).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
