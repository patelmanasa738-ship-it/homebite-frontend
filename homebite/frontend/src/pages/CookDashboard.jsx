import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dishesApi, ordersApi } from '../api/client';
import { ChefHat, Plus, Edit2, Trash2, Clock, Check, AlertCircle, ShoppingBag, DollarSign } from 'lucide-react';

export default function CookDashboard() {
  const { user } = useAuth();
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'dishes'
  const [loading, setLoading] = useState(true);

  // Dish modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishForm, setDishForm] = useState({
    name: '',
    description: '',
    category: 'Italian',
    price: 15.00,
    prepTimeMinutes: 30,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true,
    imageUrl: '/src/assets/images/hero_home_cooking_1791702710190.jpg'
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [dishesData, ordersData] = await Promise.all([
          dishesApi.getAll(),
          ordersApi.getCookOrders()
        ]);
        setDishes(dishesData);
        setOrders(ordersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await ordersApi.updateStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleOpenAdd = () => {
    setEditingDish(null);
    setDishForm({
      name: '',
      description: '',
      category: 'Italian',
      price: 15.00,
      prepTimeMinutes: 30,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      imageUrl: '/src/assets/images/hero_home_cooking_1791702710190.jpg'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dish) => {
    setEditingDish(dish);
    setDishForm({
      name: dish.name,
      description: dish.description,
      category: dish.category,
      price: dish.price,
      prepTimeMinutes: dish.prepTimeMinutes || 30,
      isVegetarian: dish.isVegetarian || false,
      isVegan: dish.isVegan || false,
      isGlutenFree: dish.isGlutenFree || false,
      isAvailable: dish.isAvailable !== undefined ? dish.isAvailable : true,
      imageUrl: dish.imageUrl || '/src/assets/images/hero_home_cooking_1791702710190.jpg'
    });
    setIsModalOpen(true);
  };

  const handleDeleteDish = async (dishId) => {
    if (window.confirm('Are you sure you want to delete this dish from your kitchen?')) {
      await dishesApi.delete(dishId);
      setDishes(dishes.filter((d) => d.id !== dishId));
    }
  };

  const handleSaveDish = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      if (editingDish) {
        const updated = await dishesApi.update(editingDish.id, dishForm);
        setDishes(dishes.map((d) => (d.id === editingDish.id ? updated : d)));
      } else {
        const created = await dishesApi.create(dishForm);
        setDishes([created, ...dishes]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save dish');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <ChefHat className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-stone-900">
              Kitchen Studio Dashboard
            </h1>
            <p className="text-xs text-stone-500">
              Managing recipes, active batch orders, and neighborhood deliveries
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'orders'
              ? 'bg-stone-900 text-white'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Kitchen Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('dishes')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'dishes'
              ? 'bg-stone-900 text-white'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Menu Management ({dishes.length} dishes)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'orders' ? (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-stone-900">
            Active & Past Orders Queue
          </h2>

          {orders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
              <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-800">No incoming orders yet</p>
              <p className="text-xs text-stone-500 mt-0.5">As soon as customers order your homemade dishes, they will appear here live.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                    <div>
                      <span className="text-sm font-bold text-stone-900">Order #{ord.id}</span>
                      <span className="text-xs text-stone-400 mx-2">·</span>
                      <span className="text-xs text-stone-600">Customer: <strong>{ord.customerName}</strong></span>
                    </div>

                    {/* Status updater */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500 font-medium">Status:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 px-3 py-1.5 focus:outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 text-xs text-stone-700">
                    {ord.items?.map((it) => (
                      <div key={it.id} className="flex justify-between">
                        <span>{it.quantity}x {it.dishName}</span>
                        <span className="font-semibold tabular-nums">${Number(it.subtotal).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500">
                    <div>
                      Deliver to: <strong className="text-stone-800">{ord.deliveryAddress}</strong> (Phone: {ord.customerPhone})
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
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-stone-900">
              Kitchen Dishes
            </h2>
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] bg-stone-100 overflow-hidden">
                  <img
                    src={dish.imageUrl || '/src/assets/images/hero_home_cooking_1791702710190.jpg'}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-stone-900/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                    ${Number(dish.price).toFixed(2)}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                    <span className="text-orange-700 font-semibold">{dish.category}</span>
                    <span>·</span>
                    <span>{dish.prepTimeMinutes || 30} mins</span>
                  </div>

                  <h3 className="font-semibold text-stone-900 text-base line-clamp-1">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2">
                    {dish.description}
                  </p>
                </div>

                <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenEdit(dish)}
                    className="text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteDish(dish.id)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dish Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="font-display text-xl font-bold text-stone-900">
              {editingDish ? 'Edit Homemade Dish' : 'Add New Homemade Dish'}
            </h3>

            <form onSubmit={handleSaveDish} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={dishForm.name}
                  onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                  placeholder="e.g. Nonna's Four-Cheese Lasagna"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={dishForm.description}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  placeholder="Describe your family recipe, fresh ingredients, and flavor notes..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={dishForm.category}
                    onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none font-medium"
                  >
                    <option value="Italian">Italian</option>
                    <option value="Indian">Indian</option>
                    <option value="Asian">Asian</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Healthy">Healthy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={dishForm.price}
                    onChange={(e) => setDishForm({ ...dishForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    min="5"
                    value={dishForm.prepTimeMinutes}
                    onChange={(e) => setDishForm({ ...dishForm, prepTimeMinutes: parseInt(e.target.value) || 30 })}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={dishForm.imageUrl}
                    onChange={(e) => setDishForm({ ...dishForm, imageUrl: e.target.value })}
                    placeholder="/src/assets/images/..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none truncate"
                  />
                </div>
              </div>

              {/* Dietary checkboxes */}
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-stone-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishForm.isVegetarian}
                    onChange={(e) => setDishForm({ ...dishForm, isVegetarian: e.target.checked })}
                    className="rounded text-orange-600"
                  />
                  Vegetarian
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishForm.isVegan}
                    onChange={(e) => setDishForm({ ...dishForm, isVegan: e.target.checked })}
                    className="rounded text-orange-600"
                  />
                  Vegan
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishForm.isGlutenFree}
                    onChange={(e) => setDishForm({ ...dishForm, isGlutenFree: e.target.checked })}
                    className="rounded text-orange-600"
                  />
                  Gluten-Free
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 font-semibold rounded-xl hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  {formSubmitting ? 'Saving...' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
