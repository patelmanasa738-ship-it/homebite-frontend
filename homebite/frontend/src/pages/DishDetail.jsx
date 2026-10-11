import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dishesApi, reviewsApi } from '../api/client';
import { useCart } from '../context/CartContext';
import ReviewList from '../components/ReviewList';
import { Star, Clock, ChefHat, Plus, Minus, Check, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function DishDetail() {
  const { id } = useParams();
  const { addToCart, loading: cartLoading } = useCart();
  const [dish, setDish] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadDishData() {
      setLoading(true);
      try {
        const [dishData, reviewsData] = await Promise.all([
          dishesApi.getById(id),
          reviewsApi.getByDishId(id)
        ]);
        setDish(dishData);
        setReviews(reviewsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDishData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!dish) return;
    await addToCart(dish.id, quantity, specialInstructions);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleAddReview = async (reviewData) => {
    const newRev = await reviewsApi.addReview(id, reviewData);
    setReviews([newRev, ...reviews]);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-stone-500">
        Loading dish details...
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-800 font-semibold">Dish not found</p>
        <Link to="/dishes" className="text-xs text-orange-600 hover:underline mt-2 inline-block">
          Return to menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back button */}
      <div>
        <Link to="/dishes" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Dishes</span>
        </Link>
      </div>

      {/* Main PDP Grid: Left Gallery, Right Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xs">
            <img
              src={dish.imageUrl || '/src/assets/images/hero_home_cooking_1791702710190.jpg'}
              alt={dish.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Description & Story */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-4">
            <h3 className="font-semibold text-stone-900 text-lg">About This Homemade Recipe</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {dish.description}
            </p>

            {/* Dietary Tags */}
            <div className="pt-3 border-t border-stone-100 flex flex-wrap gap-4 text-xs text-stone-600 font-medium">
              {dish.isVegetarian && <span>✓ Vegetarian Friendly</span>}
              {dish.isVegan && <span>✓ 100% Plant-Based</span>}
              {dish.isGlutenFree && <span>✓ Gluten-Free Recipe</span>}
              <span>✓ Freshly Prepared Today</span>
            </div>
          </div>

          {/* Cook preview card */}
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">Cooked with love by</p>
                <h4 className="font-semibold text-stone-900 text-base">{dish.kitchenName || dish.cookName}</h4>
                <p className="text-xs text-orange-700 font-medium">{dish.cookName}</p>
              </div>
            </div>
            <Link
              to={`/cooks/${dish.cookId}`}
              className="px-3.5 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              View Cook Profile
            </Link>
          </div>
        </div>

        {/* Right Column: Sticky Contiguous Purchase Module */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-1">
                <span className="text-orange-700 font-semibold">{dish.category}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  {dish.prepTimeMinutes || 30} mins prep
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
                {dish.name}
              </h1>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-xs font-semibold text-stone-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="tabular-nums">{dish.averageRating ? dish.averageRating.toFixed(1) : '5.0'}</span>
                  <span className="text-stone-400 font-normal">({reviews.length} reviews)</span>
                </div>
              </div>

              <div className="mt-4 text-3xl font-bold text-stone-900 tabular-nums">
                ${Number(dish.price).toFixed(2)}
              </div>
            </div>

            {/* Stepper & Quantity */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-semibold tabular-nums text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-stone-500 font-medium">
                  Subtotal: <span className="font-bold text-stone-900 tabular-nums">${(Number(dish.price) * quantity).toFixed(2)}</span>
                </span>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Chef Notes / Customizations (Optional)
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Mild spice, dressing on the side..."
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Primary CTA */}
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Your Basket!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Basket · ${(Number(dish.price) * quantity).toFixed(2)}</span>
                </>
              )}
            </button>

            {/* Guarantee note */}
            <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Prepared in health-compliant certified home kitchens</span>
            </div>

          </div>
        </div>

      </div>

      {/* Reviews Section */}
      <div className="pt-8 border-t border-stone-200 max-w-4xl">
        <ReviewList reviews={reviews} onAddReview={handleAddReview} />
      </div>
    </div>
  );
}
