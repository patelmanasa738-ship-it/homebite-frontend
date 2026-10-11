import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dishesApi } from '../api/client';
import DishCard from '../components/DishCard';
import { Search, Filter, SlidersHorizontal, Check } from 'lucide-react';

const CATEGORIES = ['All', 'Italian', 'Indian', 'Asian', 'Bakery', 'Healthy'];

export default function BrowseDishes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get('category') || 'All';
  const activeQuery = searchParams.get('query') || '';

  const [searchInput, setSearchInput] = useState(activeQuery);
  const [dietFilter, setDietFilter] = useState('ALL'); // ALL, VEG, VEGAN, GF

  useEffect(() => {
    async function fetchDishes() {
      setLoading(true);
      try {
        const data = await dishesApi.search(activeQuery, activeCategory === 'All' ? '' : activeCategory);
        setDishes(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchDishes();
  }, [activeCategory, activeQuery]);

  const handleCategoryClick = (cat) => {
    const nextParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', cat);
    }
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      nextParams.set('query', searchInput.trim());
    } else {
      nextParams.delete('query');
    }
    setSearchParams(nextParams);
  };

  // Filter dishes client-side for diet
  const filteredDishes = dishes.filter((dish) => {
    if (dietFilter === 'VEG' && !dish.isVegetarian) return false;
    if (dietFilter === 'VEGAN' && !dish.isVegan) return false;
    if (dietFilter === 'GF' && !dish.isGlutenFree) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
          Explore Homemade Dishes
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Made fresh to order by verified home chefs and local bakers.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4">
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl">
          <div className="relative flex items-center bg-white rounded-xl border border-stone-200 p-1.5 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500">
            <Search className="w-5 h-5 text-stone-400 ml-3 mr-2 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by dish name, spice, or ingredient..."
              className="w-full text-sm bg-transparent border-0 focus:outline-none text-stone-800 placeholder-stone-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Categories segmented control (Functional tabs per zero-pill rules) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Diet dropdown filter */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">Diet:</span>
            <select
              value={dietFilter}
              onChange={(e) => setDietFilter(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none"
            >
              <option value="ALL">All Diets</option>
              <option value="VEG">Vegetarian Only</option>
              <option value="VEGAN">Vegan Only</option>
              <option value="GF">Gluten-Free Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dishes Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-stone-500">
          Loading fresh neighborhood dishes...
        </div>
      ) : filteredDishes.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8">
          <p className="text-stone-800 font-semibold text-base">No dishes found matching your criteria</p>
          <p className="text-xs text-stone-500 mt-1">Try searching for other dishes or clearing filters.</p>
          <button
            onClick={() => {
              setSearchParams({});
              setSearchInput('');
              setDietFilter('ALL');
            }}
            className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}
