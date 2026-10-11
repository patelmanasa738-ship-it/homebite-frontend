import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Star } from 'lucide-react';

export default function ReviewList({ reviews, onAddReview }) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Please share a few words about your experience with this dish.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onAddReview({ rating, comment: comment.trim() });
      setComment('');
      setSuccessMsg('Thank you! Your verified review has been posted.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Review Form */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200">
        <h3 className="font-semibold text-stone-900 text-base mb-2">
          Leave a Review
        </h3>
        {!isAuthenticated ? (
          <p className="text-xs text-stone-500">
            Please sign in to share your thoughts on this dish.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                {successMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Your Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-stone-500 ml-2 font-medium">
                  {rating} out of 5 stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Your Feedback
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="What did you love about this meal? The flavors, presentation, warmth..."
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Post Review'}
            </button>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="font-semibold text-stone-900 text-base mb-4">
          Community Reviews ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <p className="text-xs text-stone-500 py-6 text-center bg-white rounded-xl border border-stone-200">
            No reviews yet. Be the first neighbor to taste and review!
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-4.5 rounded-xl border border-stone-200/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                      {(rev.customerName || 'U').charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-stone-900">
                        {rev.customerName || 'Neighborhood Customer'}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed pl-9">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
