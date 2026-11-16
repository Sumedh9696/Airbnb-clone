import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Wifi, 
  Tv, 
  Flame, 
  Car, 
  Waves, 
  Coffee, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import BookingWidget from '../components/BookingWidget';
import ReviewSection from '../components/ReviewSection';

// Custom marker icon for listing detail map
const singlePinIcon = L.divIcon({
  className: 'custom-single-pin',
  html: `<div style="
    background: #FF385C; 
    color: white; 
    width: 38px; 
    height: 38px; 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    border: 2px solid white;
  ">🏠</div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19]
});

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/listings/${id}`);
      setListing(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Listing not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-container" style={{ padding: '40px 24px' }}>
        <div style={{ height: '32px', width: '50%', background: '#eee', borderRadius: '8px', marginBottom: '16px' }} />
        <div style={{ height: '380px', width: '100%', background: '#eee', borderRadius: '16px' }} />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="detail-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>{error || 'Listing not found'}</h2>
        <Link to="/" style={{ display: 'inline-block', marginTop: '16px', color: '#FF385C', fontWeight: 600 }}>
          ← Back to all listings
        </Link>
      </div>
    );
  }

  const images = Array.isArray(listing.images) && listing.images.length > 0
    ? listing.images
    : ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="detail-container">
      {/* Header */}
      <div className="detail-header">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#717171', marginBottom: '12px' }}>
          <ArrowLeft size={16} /> Back to explore
        </Link>
        <h1 className="detail-title">{listing.title}</h1>
        <div className="detail-sub-header">
          <div className="detail-meta-left">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#222' }}>
              <Star size={16} fill="#222" color="#222" />
              {listing.averageRating ? Number(listing.averageRating).toFixed(2) : 'New'}
            </span>
            <span>·</span>
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
              {listing.reviews ? `${listing.reviews.length} reviews` : '0 reviews'}
            </span>
            <span>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={16} /> {listing.address}, {listing.city}, {listing.country}
            </span>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        <img src={images[0]} alt={listing.title} className="gallery-main-img" />
        <img src={images[1] || images[0]} alt={listing.title} className="gallery-sub-img" />
        <img src={images[2] || images[0]} alt={listing.title} className="gallery-sub-img" />
        <img src={images[3] || images[0]} alt={listing.title} className="gallery-sub-img" />
        <img src={images[4] || images[1] || images[0]} alt={listing.title} className="gallery-sub-img" />
      </div>

      {/* Layout: Content Left & Sticky Booking Widget Right */}
      <div className="detail-content-layout">
        <div className="detail-main-info">
          {/* Host info banner */}
          <div className="host-info-card">
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>
                {listing.roomType} hosted by {listing.host?.name || 'Superhost'}
              </h2>
              <p style={{ color: '#717171', fontSize: '15px', marginTop: '4px' }}>
                {listing.maxGuests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.bathrooms} baths
              </p>
            </div>
            <img
              src={listing.host?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
              alt={listing.host?.name}
              className="host-avatar"
            />
          </div>

          {/* Description */}
          <div style={{ paddingBottom: '32px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>About this space</h3>
            <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#333', whiteSpace: 'pre-line' }}>
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          <div style={{ padding: '32px 0', borderBottom: '1px solid #eee' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>What this place offers</h3>
            <div className="amenities-grid">
              {(listing.amenities || []).map((amenity, idx) => (
                <div key={idx} className="amenity-item">
                  <ShieldCheck size={20} color="#717171" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map View */}
          <div style={{ padding: '32px 0', borderBottom: '1px solid #eee' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Where you will be</h3>
            <p style={{ color: '#717171', marginBottom: '16px' }}>
              {listing.city}, {listing.country}
            </p>
            {listing.latitude && listing.longitude && (
              <div style={{ height: '360px', width: '100%', borderRadius: '16px', overflow: 'hidden' }}>
                <MapContainer
                  center={[listing.latitude, listing.longitude]}
                  zoom={12}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[listing.latitude, listing.longitude]} icon={singlePinIcon}>
                    <Popup>
                      <strong>{listing.title}</strong><br />{listing.address}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <ReviewSection listing={listing} onReviewAdded={fetchListing} />
        </div>

        {/* Right Sticky Booking Box */}
        <div>
          <BookingWidget listing={listing} />
        </div>
      </div>
    </div>
  );
}
