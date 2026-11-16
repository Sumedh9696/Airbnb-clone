import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, DollarSign, Home, CalendarCheck, Star, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HostDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Listing Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Trending');
  const [propertyType, setPropertyType] = useState('Villa');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [latitude, setLatitude] = useState('37.9838');
  const [longitude, setLongitude] = useState('23.7275');
  const [pricePerNight, setPricePerNight] = useState(150);
  const [cleaningFee, setCleaningFee] = useState(30);
  const [maxGuests, setMaxGuests] = useState(2);
  const [bedrooms, setBedrooms] = useState(1);
  const [amenities, setAmenities] = useState('Wifi, Air conditioning, Kitchen, Pool');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80');
  const [submitting, setSubmitting] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/host/dashboard');
      setDashboardData(res.data.data);
    } catch (err) {
      console.error('Failed to load host dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboard();
  }, [user]);

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/listings', {
        title,
        description,
        category,
        propertyType,
        address,
        city,
        country,
        latitude: Number(latitude),
        longitude: Number(longitude),
        pricePerNight: Number(pricePerNight),
        cleaningFee: Number(cleaningFee),
        maxGuests: Number(maxGuests),
        bedrooms: Number(bedrooms),
        amenities: amenities.split(',').map(s => s.trim()),
        images: [imageUrl]
      });

      setShowCreateModal(false);
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/listings/${listingId}`);
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Loading Host Dashboard...</h2>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const listings = dashboardData?.listings || [];
  const reservations = dashboardData?.recentReservations || [];

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Host Dashboard</h1>
          <p style={{ color: '#717171' }}>Welcome back, {user?.name}</p>
        </div>
        <button
          className="primary-btn"
          style={{ width: 'auto', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => setShowCreateModal(true)}
        >
          <PlusCircle size={18} />
          <span>Create New Listing</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value">${stats.totalRevenue || 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Active Listings</div>
          <div className="stat-value">{stats.totalListings || 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Reservations</div>
          <div className="stat-value">{stats.totalReservations || 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Average Host Rating</div>
          <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={24} fill="#222" color="#222" />
            <span>{stats.averageHostRating || '5.0'}</span>
          </div>
        </div>
      </div>

      {/* Your Listings Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          Your Hosted Properties ({listings.length})
        </h2>

        {listings.length === 0 ? (
          <p style={{ color: '#717171' }}>You have not published any listings yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {listings.map((item) => (
              <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80'}
                  alt={item.title}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <div style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: '#717171', marginBottom: '10px' }}>
                    {item.city}, {item.country} · ${item.pricePerNight} / night
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>
                      {item.bookings?.length || 0} bookings
                    </span>
                    <button
                      onClick={() => handleDeleteListing(item.id)}
                      style={{ color: '#D32F2F', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Reservations Table */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          Recent Guest Reservations
        </h2>
        {reservations.length === 0 ? (
          <p style={{ color: '#717171' }}>No reservations yet.</p>
        ) : (
          <div style={{ overflowX: 'auto', border: '1px solid #eee', borderRadius: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                <tr>
                  <th style={{ padding: '12px 16px' }}>Guest</th>
                  <th style={{ padding: '12px 16px' }}>Listing</th>
                  <th style={{ padding: '12px 16px' }}>Dates</th>
                  <th style={{ padding: '12px 16px' }}>Payout</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{r.guest?.name}</td>
                    <td style={{ padding: '12px 16px' }}>{r.listing?.title}</td>
                    <td style={{ padding: '12px 16px' }}>{r.startDate} to {r.endDate}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>${r.totalPrice}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: r.status === 'cancelled' ? '#FFEBEE' : '#E8F5E9',
                        color: r.status === 'cancelled' ? '#C62828' : '#2E7D32'
                      }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
              Create New Airbnb Listing
            </h2>

            <form onSubmit={handleCreateListing}>
              <div className="form-group">
                <label>Listing Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Sunset Penthouse with Private Terrace"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the experience, the light, the view, and neighborhood..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Trending">Trending</option>
                    <option value="Beachfront">Beachfront</option>
                    <option value="Cabins">Cabins</option>
                    <option value="Mansions">Mansions</option>
                    <option value="Iconic cities">Iconic cities</option>
                    <option value="Lake">Lakefront</option>
                    <option value="Countryside">Countryside</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Property Type</label>
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Cabin">Cabin</option>
                    <option value="House">House</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 142 Via del Corso"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    required
                    placeholder="Rome"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    required
                    placeholder="Italy"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Latitude (for Map)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Longitude (for Map)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Price per Night ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Max Guests</label>
                  <input
                    type="number"
                    min="1"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Amenities (comma separated)</label>
                <input
                  type="text"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Photo URL (Unsplash or direct image link)</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '10px 18px', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={submitting}
                  style={{ width: 'auto', padding: '10px 24px' }}
                >
                  {submitting ? 'Publishing...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
