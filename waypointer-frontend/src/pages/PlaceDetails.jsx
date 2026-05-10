import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';

export default function PlaceDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isInstitution = searchParams.get('type') === 'institution';
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [expandedReviews, setExpandedReviews] = useState({});

  const targetType = isInstitution ? 'institution' : 'place';
  const endpoint = isInstitution ? `/institutions/${id}` : `/places/${id}`;

  useEffect(() => {
    setLoading(true);
    api.get(endpoint).then(r => setItem(r.data)).finally(() => setLoading(false));
    if (user) {
      api.get('/favorites/check', { params: { target_type: targetType, target_id: id } })
        .then(r => setFavorited(r.data.favorited));
    }
  }, [id]);

  const toggleFavorite = async () => {
    if (!user) return;
    const { data } = await api.post('/favorites/toggle', { target_type: targetType, target_id: id });
    setFavorited(data.favorited);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reviews', { target_type: targetType, target_id: id, ...review });
      setReviewSuccess(t('places.reviewSubmitted'));
      api.get(endpoint).then(r => setItem(r.data));
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      setReviewSuccess(err.response?.data?.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleReviewExpand = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const renderComment = (comment, reviewId) => {
    if (!comment) return null;
    const maxLength = 200;
    const isLong = comment.length > maxLength;
    const isExpanded = expandedReviews[reviewId];
    
    if (!isLong) {
      return <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">{comment}</p>;
    }
    
    return (
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
          {isExpanded ? comment : `${comment.substring(0, maxLength)}...`}
        </p>
        <button
          onClick={() => toggleReviewExpand(reviewId)}
          className="text-sm text-green-600 dark:text-teal-400 hover:underline mt-1"
        >
          {isExpanded ? t('places.showLess') : t('places.readMore')}
        </button>
      </div>
    );
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center py-20">{t('common.loading')}</div>
    </div>
  );
  
  if (!item) return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">{t('places.notFound')}</p>
        <Link to="/explore" className="btn-primary">{t('places.backToExplore')}</Link>
      </div>
    </div>
  );

  // Получаем URL изображения
  const getImageUrl = () => {
    if (item.image_url) return item.image_url;
    if (item.image) return `${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${item.image}`;
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/explore" className="text-sm text-green-600 dark:text-teal-400 hover:underline mb-4 inline-block">
        ← {t('places.backToExplore')}
      </Link>

      <div className="card overflow-hidden">
        {/* Image */}
        {imageUrl && (
          <div className="h-96 overflow-hidden">
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">{item.name}</h1>
              <p className="text-gray-600 dark:text-gray-300">{item.city}, {item.country}</p>
            </div>
            {user && (
              <button 
                onClick={toggleFavorite}
                className={`text-3xl transition-transform hover:scale-110 ${favorited ? 'text-red-500' : 'text-gray-300 dark:text-gray-600'}`}
                title={favorited ? t('places.removeFromFavorites') : t('places.addToFavorites')}
              >
                ♥
              </button>
            )}
          </div>

          {/* Rating */}
          {item.review_count > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating value={Math.round(item.rating)} readonly />
              <span className="text-lg font-semibold">{item.rating?.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({item.review_count} {t('places.reviews')})</span>
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div className="mb-6">
              <h2 className="text-xl font-display font-semibold mb-3">{t('cities.about')}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.description}</p>
            </div>
          )}

          {/* Category */}
          {(item.category || item.type) && (
            <div className="mb-6">
              <h3 className="text-lg font-display font-semibold mb-2">{t('places.category')}</h3>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                {item.category || item.type}
              </span>
            </div>
          )}

          {/* Address */}
          {item.address && (
            <div className="mb-6">
              <h3 className="text-lg font-display font-semibold mb-2">{t('cities.address')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.address}</p>
            </div>
          )}

          {/* Location */}
          {(item.latitude && item.longitude) && (
            <div className="mb-6">
              <h3 className="text-lg font-display font-semibold mb-2">{t('places.location')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('cities.coordinates')}: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
              </p>
              <a
                href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                View on Google Maps
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-8">
        <h2 className="text-xl font-display font-bold mb-4 text-gray-900 dark:text-gray-600">{t('places.reviews')} ({item.reviews?.length || 0})</h2>

        {user ? (
          <div className="card p-6 mb-6">
            <h3 className="font-semibold mb-3">{t('places.addReview')}</h3>
            {reviewSuccess && <p className="text-sm text-green-600 mb-3">{reviewSuccess}</p>}
            <form onSubmit={submitReview} className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">{t('places.yourRating')}</label>
                <StarRating value={review.rating} onChange={r => setReview({ ...review, rating: r })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t('places.yourComment')}</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder={t('places.yourComment')}
                  value={review.comment}
                  onChange={e => {
                    if (e.target.value.length <= 1000) {
                      setReview({ ...review, comment: e.target.value });
                    }
                  }}
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('places.characterCount', { count: review.comment.length })}
                </p>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-fit">
                {submitting ? t('places.submitting') : t('places.submitReview')}
              </button>
            </form>
          </div>
        ) : (
          <div className="card p-6 mb-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-3">{t('places.loginToReview')}</p>
            <Link to="/login" className="btn-primary inline-block">{t('nav.login')}</Link>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {item.reviews?.length === 0 && <p className="text-gray-500 dark:text-gray-600">{t('places.noReviews')}</p>}
          {item.reviews?.map(r => (
            <div key={r.id} className="card p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                  {r.user?.name?.[0]?.toUpperCase()}
                </div>
                <span className="font-medium text-sm">{r.user?.name}</span>
                <span className="text-amber-400 text-sm">{'★'.repeat(r.rating)}</span>
              </div>
              {renderComment(r.comment, r.id)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}