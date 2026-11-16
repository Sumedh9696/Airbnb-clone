import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReviewSection({ listing, onReviewAdded }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [cleanliness, setCleanliness] = useState(5);
  const [accuracy, setAccuracy] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const reviews = listing.reviews || [];
  const averageRating = listing.averageRating || null;
  const breakdown = listing.ratingBreakdown || {
    cleanliness: 5.0,
    accuracy: 5.0,
    communication: 5.0,
    location: 5.0,
    checkIn: 5.0,
    value: 5.0
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await api.post('/reviews', {
        listingId: listing.id,
        rating: Number(rating),
        cleanliness: Number(cleanliness),
        accuracy: Number(accuracy),
        communication: Number(communication),
        comment
      });
      setComment('');
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reviews-section">
      <div className="reviews-summary-header">
        <Star size={22} fill="#222" color="#222" />
        <span>{averageRating ? `${averageRating} · ${reviews.length} reviews` : 'No reviews yet'}</span>
      </div>

      {reviews.length > 0 && (
        <div className="rating-breakdown-grid">
          {[
            { label: 'Cleanliness', val: breakdown.cleanliness },
            { label: 'Accuracy', val: breakdown.accuracy },
            { label: 'Communication', val: breakdown.communication },
            { label: 'Location', val: breakdown.location },
            { label: 'Check-in', val: breakdown.checkIn },
            { label: 'Value', val: breakdown.value }
          ].map((item) => (
            <div key={item.label} className="breakdown-row">
              <span>{item.label}</span>
              <div className="progress-bar-container">
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${(item.val / 5) * 100}%` }}
                  />
                </div>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>{item.val}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Cards Grid */}
      <div className="reviews-grid">
        {reviews.map((rev) => (
          <div key={rev.id} className="review-item">
            <div className="reviewer-header">
              <img
                src={rev.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={rev.author?.name}
                className="reviewer-avatar"
              />
              <div>
                <div style={{ fontWeight: 700 }}>{rev.author?.name || 'Verified Guest'}</div>
                <div style={{ fontSize: '13px', color: '#717171' }}>
                  {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '14px', lineHeight: 1.5 }}>
              {rev.comment}
            </div>
          </div>
        ))}
      </div>

      {/* Write a Review Box (if logged in and not the host) */}
      {user && user.id !== listing.hostId && (
        <div style={{ marginTop: '48px', padding: '24px', background: '#F7F7F7', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
            Leave a review for this stay
          </h3>
          {error && (
            <div style={{ color: '#D32F2F', fontSize: '13px', marginBottom: '12px' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleReviewSubmit}>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Overall Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Your Feedback</label>
              <textarea
                rows="3"
                placeholder="What was great about your stay? How was the host?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={submitting}
              style={{ width: 'auto', padding: '10px 24px' }}
            >
              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
