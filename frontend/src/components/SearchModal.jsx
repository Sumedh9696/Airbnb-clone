import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, onSearch, currentFilters }) {
  const [city, setCity] = useState(currentFilters.city || '');
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || '');
  const [guests, setGuests] = useState(currentFilters.guests || '1');
  const [propertyType, setPropertyType] = useState(currentFilters.propertyType || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      city,
      minPrice,
      maxPrice,
      guests,
      propertyType
    });
    onClose();
  };

  const handleReset = () => {
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setGuests('1');
    setPropertyType('');
    onSearch({});
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
          Filters & Search
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Where to? (City or Destination)</label>
            <input
              type="text"
              placeholder="e.g. Santorini, Bali, New York, Grindelwald"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Min Price per Night ($)</label>
              <input
                type="number"
                placeholder="50"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Max Price per Night ($)</label>
              <input
                type="number"
                placeholder="1000"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Guests</label>
              <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4+ Guests</option>
                <option value="6">6+ Guests</option>
              </select>
            </div>

            <div className="form-group">
              <label>Property Type</label>
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                <option value="">Any property type</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Cabin">Cabin</option>
                <option value="House">House</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            <button type="button" onClick={handleReset} style={{ textDecoration: 'underline', fontWeight: 600 }}>
              Clear all
            </button>
            <button type="submit" className="primary-btn" style={{ width: 'auto', padding: '12px 24px' }}>
              Show Listings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
