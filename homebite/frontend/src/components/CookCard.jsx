import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Award } from 'lucide-react';

export default function CookCard({ cook }) {
  return (
    <div className="bg-[#FEFCF9] rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Banner & Avatar */}
      <div className="relative h-28 bg-stone-200 overflow-hidden">
        <img
          src={cook.bannerUrl || '/src/assets/images/hero_home_cooking_1791702710190.jpg'}
          alt={cook.kitchenName}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/src/assets/images/hero_home_cooking_1791702710190.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      <div className="px-5 pt-0 pb-5 -mt-8 flex-1 flex flex-col justify-between relative">
        <div>
          {/* Avatar & Verification */}
          <div className="flex items-end justify-between mb-3">
            <div className="relative w-14 h-14 rounded-full border-2 border-white overflow-hidden bg-stone-100 shadow-sm">
              <img
                src={cook.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
                alt={cook.cookName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {cook.isVerified && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                <Award className="w-3 h-3 text-emerald-600" />
                Verified Cook
              </span>
            )}
          </div>

          {/* Kitchen details */}
          <h3 className="font-semibold text-stone-900 text-base leading-tight">
            {cook.kitchenName}
          </h3>
          <p className="text-xs text-orange-700 font-medium mt-0.5">
            by {cook.cookName}
          </p>

          <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
            {cook.bio}
          </p>

          <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">{cook.kitchenAddress}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-semibold text-stone-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="tabular-nums">{cook.ratingAvg ? Number(cook.ratingAvg).toFixed(2) : '5.00'}</span>
            <span className="text-stone-400 font-normal">({cook.ratingCount || 24} reviews)</span>
          </div>

          <Link
            to={`/cooks/${cook.id}`}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
          >
            View Menu →
          </Link>
        </div>
      </div>
    </div>
  );
}
