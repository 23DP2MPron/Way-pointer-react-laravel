import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import openTripMapService from '../services/openTripMapService';
import pexelsService from '../services/pexelsService';
import StarRating from '../components/StarRating';

export default function ExternalPlaceDetails() {
  const { t } = useTranslation();
  const { xid } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'place';
  const { user } = useAuth();
  
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviews, setReviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [expandedReviews, setExpandedReviews] = useState({});

  useEffect(() => {
    const loadPlaceDetails = async () => {
      setLoading(true);
      try {
        // Load details from OpenTripMap
        const details = await openTripMapService.getPlaceDetails(xid);
        
        if (details) {
          setPlace(details);
          
          // Try to load image from Pexels
          const photo = await pexelsService.getPlacePhoto(details.name, details.address?.city || '');
          if (photo) {
            setImageUrl(photo);
          } else if (details.preview?.source) {
            setImageUrl(details.preview.source);
          } else if (details.image) {
            setImageUrl(details.image);
          }
          
          // Load reviews from localStorage (temporary storage for external places)
          const storedReviews = localStorage.getItem(`reviews_external_${xid}`);
          if (storedReviews) {
            setReviews(JSON.parse(storedReviews));
          }
        }
      } catch (error) {
        console.error('Error loading external place:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaceDetails();
  }, [xid]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    try {
      const newReview = {
        id: Date.now(),
        rating: review.rating,
        comment: review.comment,
        user: { name: user.name },
        created_at: new Date().toISOString()
      };
      
      const updatedReviews = [...reviews, newReview];
      setReviews(updatedReviews);
      
      // Сохраняем в localStorage
      localStorage.setItem(`reviews_external_${xid}`, JSON.stringify(updatedReviews));
      
      setReviewSuccess('Review submitted!');
      setReview({ rating: 5, comment: '' });
      
      setTimeout(() => setReviewSuccess(''), 3000);
    } catch (err) {
      setReviewSuccess('Error submitting review');
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
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center py-20">Loading...</div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Place not found</p>
          <Link to="/explore" className="btn-primary">Back to Explore</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/explore" className="text-sm text-green-600 dark:text-teal-400 hover:underline mb-4 inline-block">
        ← Back to Explore
      </Link>

      <div className="card overflow-hidden">
        {/* Image */}
        {imageUrl && (
          <div className="h-96 overflow-hidden">
            <img
              src={imageUrl}
              alt={place.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">{place.name}</h1>
              {place.address && (
                <p className="text-gray-600 dark:text-gray-300">
                  {[
                    place.address.road,
                    place.address.city,
                    place.address.state,
                    place.address.country
                  ].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Rating */}
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500 text-xl">★</span>
              <span className="text-lg font-semibold">
                {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
            </div>
          )}

          {/* Description */}
          {(place.wikipedia_extracts?.text || place.info?.descr) && (
            <div className="mb-6">
              <h2 className="text-xl font-display font-semibold mb-3">About</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {place.wikipedia_extracts?.text || place.info?.descr}
              </p>
            </div>
          )}

          {/* Categories */}
          {place.kinds && (
            <div className="mb-6">
              <h3 className="text-lg font-display font-semibold mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {place.kinds.split(',').map((kind, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {kind.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          {place.point && (
            <div className="mb-6">
              <h3 className="text-lg font-display font-semibold mb-2">Location</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Coordinates: {place.point.lat.toFixed(4)}, {place.point.lon.toFixed(4)}
              </p>
              <a
                href={`https://www.google.com/maps?q=${place.point.lat},${place.point.lon}`}
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
        <h2 className="text-xl font-display font-bold mb-4 text-gray-900 dark:text-gray-600">Reviews ({reviews.length})</h2>

        {user && (
          <div className="card p-6 mb-6">
            <h3 className="font-semibold mb-3">Leave a Review</h3>
            {reviewSuccess && <p className="text-sm text-green-600 mb-3">{reviewSuccess}</p>}
            <form onSubmit={submitReview} className="flex flex-col gap-3">
              <StarRating value={review.rating} onChange={r => setReview({ ...review, rating: r })} />
              <div>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="Share your experience..."
                  value={review.comment}
                  onChange={e => {
                    if (e.target.value.length <= 1000) {
                      setReview({ ...review, comment: e.target.value });
                    }
                  }}
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {review.comment.length}/1000 characters
                </p>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-fit">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {reviews.length === 0 && <p className="text-gray-500 dark:text-gray-600">No reviews yet. Be the first to review this place!</p>}
          {reviews.map(r => (
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
