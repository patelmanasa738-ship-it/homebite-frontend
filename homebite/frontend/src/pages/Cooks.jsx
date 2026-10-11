import React, { useState, useEffect } from 'react';
import { cooksApi } from '../api/client';
import CookCard from '../components/CookCard';
import { ChefHat, Search } from 'lucide-react';

export default function Cooks() {
  const [cooks, setCooks] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCooks() {
      try {
        const data = await cooksApi.getAll();
        setCooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCooks();
  }, []);

  const filtered = cooks.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      c.kitchenName.toLowerCase().includes(q) ||
      c.cookName.toLowerCase().includes(q) ||
      (c.specialty && c.specialty.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
          Neighborhood Cooks & Bakers
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Support local culinary talent crafting heirloom recipes in small batches.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <div className="relative flex items-center bg-white rounded-xl border border-stone-200 p-1.5">
          <Search className="w-5 h-5 text-stone-400 ml-3 mr-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by cook name or specialty..."
            className="w-full text-sm bg-transparent border-0 focus:outline-none text-stone-800"
          />
        </div>
      </div>

      {/* Cooks Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-stone-500">
          Loading neighborhood kitchens...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-stone-200">
          <p className="text-stone-800 font-semibold">No cooks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((cook) => (
            <CookCard key={cook.id} cook={cook} />
          ))}
        </div>
      )}
    </div>
  );
}
