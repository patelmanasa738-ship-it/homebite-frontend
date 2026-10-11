import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, Clock, Plus, Check } from 'lucide-react';

export default function DishCard({ dish }) {
  const { addToCart, loading } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(dish.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-[#FEFCF9] rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Dish Image */}
      <Link to={`/dishes/${dish.id}`} className="relative block aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={dish.imageUrl || '/src/assets/images/hero_home_cooking_1791702710190.jpg'}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/src/assets/images/dish_lasagna_1791702722110.jpg';
          }}
        />
        
        {/* Quick prep tag */}
        <div className="absolute bottom-3 left-3 bg-stone-900/75 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
          <Clock className="w-3 h-3 text-stone-300" />
          <span>{dish.prepTimeMinutes || 30} mins</span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Typographic metadata (No static pills) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-1.5">
            <span className="text-orange-700 font-semibold">{dish.category}</span>
            <span aria-hidden="true">·</span>
            <span>{dish.kitchenName || dish.cookName}</span>
          </div>

          {/* Dish Name */}
          <Link to={`/dishes/${dish.id}`} className="block">
            <h3 className="font-semibold text-stone-900 text-base group-hover:text-orange-600 transition-colors line-clamp-1">
              {dish.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
            {dish.description}
          </p>
        </div>

        {/* Footer info: Rating, Price, Add Button */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-xs font-semibold text-stone-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{dish.averageRating ? dish.averageRating.toFixed(1) : '5.0'}</span>
              <span className="text-stone-400 font-normal">({dish.reviewCount || 12})</span>
            </div>
            <div className="text-base font-bold text-stone-900 tabular-nums mt-0.5">
              ${Number(dish.price).toFixed(2)}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={loading}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 hover:bg-orange-600 text-white shadow-xs'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
