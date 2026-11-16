import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';

export default function ListingCard({ listing }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const images = Array.isArray(listing.images) && listing.images.length > 0
    ? listing.images
    : ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80'];

  const handleCardClick = () => {
    navigate(`/listings/${listing.id}`);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="listing-card" onClick={handleCardClick}>
      <div className="card-img-wrapper">
        <img src={images[0]} alt={listing.title} loading="lazy" />
        <button 
          className="card-favorite-btn" 
          onClick={handleFavorite}
          aria-label="Add to favorites"
        >
          <Heart 
            size={24} 
            fill={isLiked ? '#FF385C' : 'rgba(0, 0, 0, 0.4)'} 
            stroke={isLiked ? '#FF385C' : '#FFFFFF'} 
            strokeWidth={2}
          />
        </button>
      </div>

      <div className="card-info">
        <div className="card-header-row">
          <span className="card-location">{listing.city}, {listing.country}</span>
          <div className="card-rating">
            <Star size={14} fill="#222222" color="#222222" />
            <span>{listing.averageRating ? Number(listing.averageRating).toFixed(2) : 'New'}</span>
          </div>
        </div>

        <span className="card-subtitle">{listing.title}</span>
        <span className="card-subtitle">{listing.category} · {listing.propertyType}</span>

        <div className="card-price-row">
          <strong>${listing.pricePerNight}</strong> <span>night</span>
        </div>
      </div>
    </div>
  );
}
