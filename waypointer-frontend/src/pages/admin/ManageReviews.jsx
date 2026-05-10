import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [expandedComments, setExpandedComments] = useState(new Set());

  const load = () => {
    setLoading(true);
    api.get('/reviews?per_page=100').then(r => setReviews(r.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm('Delete this review? This action cannot be undone.')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setMsg('Review deleted successfully!');
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error deleting review');
    }
  };

  const toggleComment = (id) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedComments(newExpanded);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getTargetLink = (review) => {
    const type = review.reviewable_type || review.target_type;
    const id = review.reviewable_id || review.target_id;
    
    if (type === 'App\\Models\\Route') {
      return `/routes/${id}`;
    } else if (type === 'App\\Models\\Place') {
      return `/places/${id}`;
    } else if (type === 'App\\Models\\Institution') {
      return `/institutions/${id}`;
    }
    return null;
  };

  const getTargetTypeName = (review) => {
    const type = review.reviewable_type || review.target_type;
    if (type === 'App\\Models\\Route') return 'Route';
    if (type === 'App\\Models\\Place') return 'Place';
    if (type === 'App\\Models\\Institution') return 'Institution';
    return type;
  };

  const getTargetName = (review) => {
    if (review.reviewable) {
      return review.reviewable.name || review.reviewable.title || 'Unknown';
    }
    return `#${review.reviewable_id || review.target_id}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">Manage Reviews</h1>

      {msg && (
        <div className={`mb-6 p-4 rounded-lg ${msg.includes('Error') ? 'bg-red-50 dark:bg-red-900/30 text-red-600' : 'bg-green-50 dark:bg-green-900/30 text-green-600'}`}>
          {msg}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No reviews found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map(r => {
            const isExpanded = expandedComments.has(r.id);
            const shouldTruncate = r.comment && r.comment.length > 200;
            const displayComment = shouldTruncate && !isExpanded 
              ? r.comment.substring(0, 200) + '...' 
              : r.comment;

            return (
              <div key={r.id} className="card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white text-sm flex items-center justify-center font-bold shrink-0">
                        {r.user?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{r.user?.name || 'Unknown User'}</span>
                          <span className="text-amber-400 text-lg">{'★'.repeat(r.rating)}<span className="text-gray-300">{'★'.repeat(5 - r.rating)}</span></span>
                          <span className="text-xs text-gray-400">
                            {formatDate(r.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            {getTargetTypeName(r)}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            {getTargetName(r)}
                          </span>
                          {getTargetLink(r) && (
                            <Link 
                              to={getTargetLink(r)}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              View →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                    {r.comment && (
                      <div className="ml-10 max-w-full overflow-hidden">
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all">
                          {displayComment}
                        </p>
                        {shouldTruncate && (
                          <button
                            onClick={() => toggleComment(r.id)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                          >
                            {isExpanded ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => del(r.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors shrink-0"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}