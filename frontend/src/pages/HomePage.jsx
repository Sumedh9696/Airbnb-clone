import React, { useState, useEffect } from 'react';
import { Map, List, Frown } from 'lucide-react';
import api from '../services/api';
import CategoriesBar from '../components/CategoriesBar';
import ListingCard from '../components/ListingCard';
import MapView from '../components/MapView';

export default function HomePage({ filters, onResetFilters }) {
  const [listings, setListings] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params = { ...filters };
        if (activeCategory && activeCategory !== 'All') {
          params.category = activeCategory;
        }
        const res = await api.get('/listings', { params });
        setListings(res.data.data || []);
      } catch (err) {
        console.error('Failed to load listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [activeCategory, filters]);

  return (
    <div>
      {/* Category Icons Carousel */}
      <CategoriesBar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      <div className="listings-grid-container">
        {loading ? (
          <div className="listings-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ width: '100%', aspectRatio: '20/19', background: '#eee', borderRadius: '16px' }} />
                <div style={{ width: '60%', height: '18px', background: '#eee', borderRadius: '4px' }} />
                <div style={{ width: '40%', height: '14px', background: '#eee', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Frown size={48} style={{ color: '#717171', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No exact matches found</h2>
            <p style={{ color: '#717171', marginBottom: '24px' }}>
              Try changing or clearing some of your filters to see more results.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                if (onResetFilters) onResetFilters();
              }}
              className="primary-btn"
              style={{ width: 'auto', padding: '12px 24px' }}
            >
              Clear all filters
            </button>
          </div>
        ) : showMap ? (
          <MapView listings={listings} />
        ) : (
          <div className="listings-grid">
            {listings.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Toggle Map / Grid View Button */}
      {listings.length > 0 && (
        <button
          className="map-toggle-float"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? (
            <>
              <span>Show list</span>
              <List size={18} />
            </>
          ) : (
            <>
              <span>Show map</span>
              <Map size={18} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
