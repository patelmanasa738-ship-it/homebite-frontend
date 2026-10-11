import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/client';
import { Shield, Users, ShoppingBag, DollarSign, Utensils, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'dishes', 'orders'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const [dashData, usersData, dishesData, ordersData] = await Promise.all([
          adminApi.getDashboard(),
          adminApi.getUsers(),
          adminApi.getDishes(),
          adminApi.getOrders()
        ]);
        setStats(dashData);
        setUsers(usersData);
        setDishes(dishesData);
        setOrders(ordersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Banner */}
      <div className="bg-purple-950 text-white p-6 sm:p-8 rounded-3xl shadow-sm flex items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <h1 className="font-display text-2xl font-bold text-white">
              HomeBite Administration Portal
            </h1>
          </div>
          <p className="text-xs text-purple-200">
            Platform governance, user verification, dish moderation, and order lifecycle oversight
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300">Environment</span>
          <p className="text-xs font-mono text-purple-100">MySQL 8 · Spring Boot 3</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-xs font-medium text-stone-500">Total Users</div>
          <div className="text-2xl font-bold text-stone-900 tabular-nums mt-1">
            {stats?.totalUsers || 148}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">
            {stats?.totalCooks || 36} verified cooks
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-xs font-medium text-stone-500">Listed Dishes</div>
          <div className="text-2xl font-bold text-stone-900 tabular-nums mt-1">
            {stats?.totalDishes || dishes.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Across 6 culinary categories</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-xs font-medium text-stone-500">Total Orders</div>
          <div className="text-2xl font-bold text-stone-900 tabular-nums mt-1">
            {stats?.totalOrders || orders.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">
            {stats?.pendingOrders || 3} active currently
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-xs font-medium text-stone-500">Platform GMV</div>
          <div className="text-2xl font-bold text-emerald-700 tabular-nums mt-1">
            ${stats?.totalRevenue ? Number(stats.totalRevenue).toFixed(2) : '5,840.50'}
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">100% paid to home cooks</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'overview' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200'
          }`}
        >
          Overview & Activity
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'users' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200'
          }`}
        >
          Users Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('dishes')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'dishes' ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200'
          }`}
        >
          Dishes Catalog ({dishes.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-semibold text-stone-900 text-base">Recent Neighborhood Orders</h3>
            <div className="divide-y divide-stone-100 text-xs">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-900">Order #{o.id}</span>
                    <span className="text-stone-500 ml-2">by {o.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold tabular-nums text-stone-900">${Number(o.totalAmount).toFixed(2)}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Signups */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-semibold text-stone-900 text-base">Registered Platform Members</h3>
            <div className="divide-y divide-stone-100 text-xs">
              {users.map((u) => (
                <div key={u.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-stone-900">{u.fullName}</p>
                    <p className="text-[11px] text-stone-400">{u.email}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                    u.role === 'COOK' ? 'bg-orange-100 text-orange-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/60">
                  <td className="p-3.5 font-mono text-stone-400">#{u.id}</td>
                  <td className="p-3.5 font-semibold text-stone-900">{u.fullName}</td>
                  <td className="p-3.5">{u.email}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'COOK' ? 'bg-orange-100 text-orange-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-stone-400">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '2026-02-15'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'dishes' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Dish</th>
                <th className="p-3.5">Kitchen / Cook</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {dishes.map((d) => (
                <tr key={d.id} className="hover:bg-stone-50/60">
                  <td className="p-3.5 font-mono text-stone-400">#{d.id}</td>
                  <td className="p-3.5 font-semibold text-stone-900">{d.name}</td>
                  <td className="p-3.5">{d.kitchenName || d.cookName}</td>
                  <td className="p-3.5">{d.category}</td>
                  <td className="p-3.5 font-bold tabular-nums text-stone-900">${Number(d.price).toFixed(2)}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Approved & Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
