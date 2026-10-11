import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dishesApi, cooksApi } from '../api/client';
import DishCard from '../components/DishCard';
import CookCard from '../components/CookCard';
import { Search, Heart, ShieldCheck, Sparkles, ArrowRight, Utensils, Clock, Flame } from 'lucide-react';

export default function Home() {
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [featuredCooks, setFeaturedCooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [dishes, cooks] = await Promise.all([
          dishesApi.getAll(),
          cooksApi.getAll()
        ]);
        setFeaturedDishes(dishes.slice(0, 4));
        setFeaturedCooks(cooks.slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dishes?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/dishes');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <section className="relative pt-6 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-800 bg-orange-100/80 px-3 py-1 rounded-md">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span>Real Kitchens · Authentic Family Recipes · Zero Factory Food</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1] max-w-2xl text-balance">
                Taste the Love of Home Cooking
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
                Discover fresh, homemade meals crafted with love by cooks in your neighborhood.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl">
                <div className="relative flex items-center bg-white rounded-2xl border border-stone-200/90 shadow-sm p-2 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500">
                  <Search className="w-5 h-5 text-stone-400 ml-3 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dishes (e.g. lasagna, butter chicken, dumplings...)"
                    className="w-full text-sm bg-transparent border-0 focus:outline-none text-stone-800 placeholder-stone-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    Find Food
                  </button>
                </div>
              </form>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-stone-500 pt-1">
                <span className="font-medium text-stone-700">Popular:</span>
                <Link to="/dishes?category=Italian" className="hover:text-orange-600">Handmade Pasta</Link>
                <span>·</span>
                <Link to="/dishes?category=Indian" className="hover:text-orange-600">Slow Curries</Link>
                <span>·</span>
                <Link to="/dishes?category=Asian" className="hover:text-orange-600">Artisanal Dim Sum</Link>
                <span>·</span>
                <Link to="/dishes?category=Bakery" className="hover:text-orange-600">Fresh Bread</Link>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-lg aspect-[4/3] lg:aspect-[1/1] bg-stone-100">
                <img
                  src="/src/assets/images/hero_home_cooking_1791702710190.jpg"
                  alt="Warm artisanal homemade meal"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                
                {/* Floating highlight badge */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-stone-900">Slow-Cooked With Family Pride</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">Cooked in small batches today in your neighborhood</p>
                    </div>
                    <Link
                      to="/dishes"
                      className="px-3 py-1.5 bg-stone-900 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Featured Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              Fresh from Today’s Kitchens
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Cooked fresh upon order with pure ingredients and generous portions.
            </p>
          </div>
          <Link
            to="/dishes"
            className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1.5"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="bg-stone-100/70 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              How HomeBite Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Bringing the kitchen table to your doorstep in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-semibold text-stone-900 text-base">Explore Local Kitchens</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Browse passionate home cooks nearby. Filter by authentic cuisines, dietary needs, or cook specialties.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-semibold text-stone-900 text-base">Cook Prepares Fresh</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your meal is cooked specifically for you—no reheat lamps, no mass preservatives, only pure ingredients.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-semibold text-stone-900 text-base">Warm Delivery to Your Door</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Delivered safely to your table in insulated containers, ready to enjoy with friends and family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Meet The Neighborhood Cooks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              Meet Your Neighborhood Cooks
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Every dish tells a family story. Get to know the faces behind your favorite recipes.
            </p>
          </div>
          <Link
            to="/cooks"
            className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1.5"
          >
            <span>See All Cooks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCooks.map((cook) => (
            <CookCard key={cook.id} cook={cook} />
          ))}
        </div>
      </section>

      {/* 5. Cook Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3 z-10">
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Join Our Community</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Do You Love Cooking For People?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Turn your signature family dishes into a thriving neighborhood food business. Set your own menu, cook schedule, and prices.
            </p>
          </div>
          <div className="z-10 shrink-0">
            <Link
              to="/register/cook"
              className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl shadow-md transition-colors whitespace-nowrap inline-block"
            >
              Start Cooking on HomeBite
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
