import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cooksApi } from '../api/client';
import DishCard from '../components/DishCard';
import { Star, MapPin, Award, ArrowLeft } from 'lucide-react';

export default function CookProfilePage() {
  const { id } = useParams();
  const [cook, setCook] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cookData, dishesData] = await Promise.all([
          cooksApi.getById(id),
          cooksApi.getDishes(id)
        ]);
        setCook(cookData);
        setDishes(dishesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-stone-500">Loading kitchen...</div>;
  }

  if (!cook) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-stone-500">Cook not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div>
        <Link to="/cooks" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Cooks</span>
        </Link>
      </div>

      {/* Kitchen Banner Card */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="relative h-48 sm:h-64 bg-stone-200">
          <img
            src={cook.bannerUrl || '/src/assets/images/hero_home_cooking_1791702710190.jpg'}
            alt={cook.kitchenName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden bg-stone-100 shadow-md">
              <img
                src={cook.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
                alt={cook.cookName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
                  {cook.kitchenName}
                </h1>
                {cook.isVerified && (
                  <Award className="w-5 h-5 text-emerald-600" title="Verified Home Cook" />
                )}
              </div>
              <p className="text-sm font-semibold text-orange-700">by {cook.cookName}</p>
              <div className="flex items-center gap-3 text-xs text-stone-500 pt-0.5">
                <span className="flex items-center gap-1 font-semibold text-stone-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {cook.ratingAvg ? Number(cook.ratingAvg).toFixed(2) : '5.00'}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {cook.kitchenAddress}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="px-6 sm:px-8 pb-8 pt-2">
          <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-1">Kitchen Story</h3>
          <p className="text-sm text-stone-600 leading-relaxed max-w-3xl">
            {cook.bio}
          </p>
        </div>
      </div>

      {/* Cook's Dishes */}
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-900">
            Current Menu & Specials ({dishes.length})
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Handcrafted fresh by {cook.cookName} upon your order.
          </p>
        </div>

        {dishes.length === 0 ? (
          <p className="py-12 text-center text-xs text-stone-500 bg-white rounded-2xl border border-stone-200">
            No dishes listed currently. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
