import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyBookings = async () => {
      setLoading(true);
      try {
        const res = await api.get('/bookings/my-bookings');
        setBookings(res.data.data || []);
      } catch (err) {
        console.error('Failed to load trips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      setActionMsg('Reservation cancelled successfully.');
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
        <h2>Loading your trips...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px' }}>
        Trips & Reservations
      </h1>

      {actionMsg && (
        <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <CheckCircle2 size={18} />
          <span>{actionMsg}</span>
        </div>
      )}

      {bookings.length === 0 ? (
        <div style={{ padding: '60px 0', borderTop: '1px solid #eee' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No trips booked... yet!</h2>
          <p style={{ color: '#717171', marginBottom: '24px' }}>
            Time to dust off your bags and start planning your next great adventure.
          </p>
          <Link to="/" className="primary-btn" style={{ display: 'inline-block', width: 'auto', padding: '12px 24px' }}>
            Start searching
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {bookings.map((booking) => {
            const listing = booking.listing;
            const images = listing?.images || [];
            const isCancelled = booking.status === 'cancelled';

            return (
              <div
                key={booking.id}
                style={{
                  display: 'flex',
                  gap: '24px',
                  border: '1px solid #DDDDDD',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <img
                  src={images[0] || 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80'}
                  alt={listing?.title}
                  style={{ width: '280px', height: '200px', objectFit: 'cover' }}
                />

                <div style={{ flex: 1, padding: '20px 20px 20px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#717171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {listing?.city}, {listing?.country}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: isCancelled ? '#FFEBEE' : '#E8F5E9',
                          color: isCancelled ? '#C62828' : '#2E7D32'
                        }}
                      >
                        {booking.status.toUpperCase()}
                      </span>
                    </div>

                    <Link to={`/listings/${listing?.id}`} style={{ fontSize: '18px', fontWeight: 700, color: '#222' }}>
                      {listing?.title}
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '14px', color: '#555' }}>
                      <Calendar size={16} />
                      <span>{booking.startDate} — {booking.endDate} ({booking.totalNights} nights)</span>
                    </div>

                    <div style={{ marginTop: '4px', fontSize: '14px', color: '#717171' }}>
                      Hosted by {listing?.host?.name || 'Superhost'} · {booking.guestCount} guests
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800 }}>
                      Total Paid: ${booking.totalPrice}
                    </div>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        style={{ color: '#D32F2F', fontSize: '13px', fontWeight: 600, textDecoration: 'underline' }}
                      >
                        Cancel reservation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
