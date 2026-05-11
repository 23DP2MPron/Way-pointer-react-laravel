import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// Компонент для отображения комментария с возможностью раскрытия
function ReviewComment({ comment }) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 200; // Максимальная длина до сокращения
  const shouldTruncate = comment.length > maxLength;

  return (
    <div>
      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
        {shouldTruncate && !expanded 
          ? comment.substring(0, maxLength) + '...' 
          : comment}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-green-600 dark:text-teal-400 text-sm mt-1 hover:underline"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}

export default function RouteDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const { data } = await api.get(`/routes/${id}/reviews`);
      setReviews(data.data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    api.get(`/routes/${id}`).then(r => {
      setRoute(r.data);
    }).finally(() => setLoading(false));
    if (user) {
      api.get('/favorites/check', { params: { target_type: 'route', target_id: id } })
        .then(r => setFavorited(r.data.favorited))
        .catch(() => {});
    }
    loadReviews();
  }, [id, user, loadReviews]);

  const toggleFavorite = async () => {
    if (!user) return;
    const { data } = await api.post('/favorites/toggle', { target_type: 'route', target_id: id });
    setFavorited(data.favorited);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    try {
      await api.post(`/routes/${id}/reviews`, { rating, comment });
      setComment('');
      setRating(5);
      setShowReviewForm(false);
      loadReviews();
      alert('Review submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!route) return <div className="text-center py-20 text-gray-500">Route not found.</div>;

  const canReview = user && route.is_published && user.id !== route.user_id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="card p-6 mb-8">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h1 className="text-3xl font-display font-bold mb-1">{route.title}</h1>
            <p className="text-sm text-gray-500">
              by {route.user?.name}
              {route.city && ` · ${route.city}, ${route.country}`}
              {route.duration_days && ` · ${route.duration_days} day(s)`}
            </p>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold">{averageRating}</span>
                <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!route.is_published && (
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">Draft</span>
            )}
            {user && (
              <button onClick={toggleFavorite}
                className={`text-3xl transition-transform hover:scale-110 ${favorited ? 'text-red-500' : 'text-gray-300 dark:text-gray-600'}`}>
                ♥
              </button>
            )}
          </div>
        </div>
        {route.description && (
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{route.description}</p>
        )}
      </div>

      <h2 className="text-xl font-display font-bold mb-4 text-gray-900 dark:text-white">Route Points</h2>

      {(!route.points || route.points.length === 0) ? (
        <p className="text-gray-500 dark:text-gray-400">No points added to this route yet.</p>
      ) : (
        <div className="flex flex-col gap-4 mb-8">
          {route.points.map((point, index) => {
            const target = point.target || point.target_detail;
            return (
              <div key={point.id} className="card p-4 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-600 dark:bg-teal-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  {target ? (
                    <>
                      <Link
                        to={`/places/${target.id}${point.target_type === 'institution' ? '?type=institution' : ''}`}
                        className="font-semibold hover:text-green-600 dark:hover:text-teal-400 transition-colors"
                      >
                        {target.name}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{target.city}, {target.country} · {point.target_type}</p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">Deleted location</p>
                  )}
                  {point.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic">"{point.notes}"</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-gray-900 dark:text-gray-600">Reviews ({reviews.length})</h2>
          {canReview && !showReviewForm && (
            <button onClick={() => setShowReviewForm(true)} className="btn-primary">
              Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={submitReview} className="card p-6 mb-6">
            <h3 className="font-semibold mb-4">Write Your Review</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-colors ${star <= rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                maxLength={1000}
                rows={4}
                className="input w-full"
                placeholder="Share your experience with this route..."
              />
              <p className="text-xs text-gray-500 mt-1">{comment.length}/1000</p>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button type="button" onClick={() => setShowReviewForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        {reviewsLoading ? (
          <p className="text-gray-500 dark:text-gray-600">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-600">No reviews yet. Be the first to review this route!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map(review => (
              <div key={review.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{review.user?.name}</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <ReviewComment comment={review.comment} />
              </div>
            ))}
          </div>
        )}
      </div>

      {user && (user.id === route.user_id || user.role === 'admin') && (
        <div className="mt-8">
          <Link to={`/routes/${id}/edit`} className="btn-secondary">Edit Route</Link>
        </div>
      )}
    </div>
  );
}