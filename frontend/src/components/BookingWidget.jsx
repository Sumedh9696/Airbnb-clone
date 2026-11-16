import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BookingWidget({ listing }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch already booked dates for this listing to inform the guest
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get(`/bookings/listing/${listing.id}`);
        setBookedRanges(res.data.data || []);
      } catch (err) {
        console.error('Failed to load listing booked ranges:', err);
      }
    };
    if (listing?.id) {
      fetchBookings();
    }
  }, [listing?.id]);

  // Calculate nights
  const nights = startDate && endDate
    ? Math.max(0, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))
    : 0;

  const nightlyRate = listing.pricePerNight || 0;
  const accommodationTotal = nightlyRate * nights;
  const cleaningFee = listing.cleaningFee || 0;
  const serviceFee = nights > 0 ? Number((accommodationTotal * 0.12).toFixed(2)) : 0;
  const grandTotal = nights > 0 ? Number((accommodationTotal + cleaningFee + serviceFee).toFixed(2)) : 0;

  // Check client-side overlap against existing booked ranges
  const isDateConflicting = (startStr, endStr) => {
    if (!startStr || !endStr) return false;
    const reqStart = new Date(startStr);
    const reqEnd = new Date(endStr);
    return bookedRanges.some(booking => {
      const bStart = new Date(booking.startDate);
      const bEnd = new Date(booking.endDate);
      return bStart < reqEnd && bEnd > reqStart;
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      navigate('/login');
      return;
    }

    if (user.id === listing.hostId) {
      setError('You are the host of this property and cannot book it.');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select check-in and check-out dates.');
      return;
    }

    if (nights <= 0) {
      setError('Check-out must be after check-in.');
      return;
    }

    if (isDateConflicting(startDate, endDate)) {
      setError('Selected dates conflict with an existing reservation. Please select different dates.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/bookings', {
        listingId: listing.id,
        startDate,
        endDate,
        guestCount: Number(guestCount)
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/trips');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-box">
      <div className="booking-box-header">
        <div className="booking-price">
          ${listing.pricePerNight} <span style={{ fontSize: '15px', fontWeight: 400, color: '#717171' }}>night</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 600 }}>
          <Star size={14} fill="#222" color="#222" />
          <span>{listing.averageRating ? Number(listing.averageRating).toFixed(2) : 'New'}</span>
          {listing.ratingCount > 0 && (
            <span style={{ color: '#717171', fontWeight: 400 }}>({listing.ratingCount})</span>
          )}
        </div>
      </div>

      {error && (
        <div style={{ background: '#FFF2F2', border: '1px solid #FFCDD2', color: '#D32F2F', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ShieldCheck size={16} />
          <span>Reservation confirmed! Redirecting to your trips...</span>
        </div>
      )}

      <form onSubmit={handleBooking}>
        <div className="dates-picker-input-grid">
          <div className="date-input-field">
            <label>CHECK-IN</label>
            <input
              type="date"
              min={todayStr}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="date-input-field">
            <label>CHECKOUT</label>
            <input
              type="date"
              min={startDate || todayStr}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="guests-input-field">
          <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#222' }}>GUESTS</label>
          <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)}>
            {[...Array(listing.maxGuests || 4)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i + 1 === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="primary-btn" disabled={loading || success}>
          {loading ? 'Confirming...' : !user ? 'Log in to Reserve' : 'Reserve'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '13px', color: '#717171', margin: '14px 0 0 0' }}>
        You won't be charged yet
      </p>

      {nights > 0 && (
        <div className="price-breakdown">
          <div className="price-row">
            <span>${listing.pricePerNight} x {nights} nights</span>
            <span>${accommodationTotal}</span>
          </div>
          {cleaningFee > 0 && (
            <div className="price-row">
              <span>Cleaning fee</span>
              <span>${cleaningFee}</span>
            </div>
          )}
          <div className="price-row">
            <span>Airbnb service fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="price-row total-row">
            <span>Total before taxes</span>
            <span>${grandTotal}</span>
          </div>
        </div>
      )}
    </div>
  );
}
