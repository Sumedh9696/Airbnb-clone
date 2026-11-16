import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

// Custom price pill icon generator for Airbnb style markers
const createPriceIcon = (price) => {
  return L.divIcon({
    className: 'custom-map-price-pill',
    html: `<div style="
      background: white; 
      color: #222; 
      font-weight: 700; 
      font-size: 13px; 
      padding: 5px 9px; 
      border-radius: 20px; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      border: 1px solid rgba(0,0,0,0.1);
      display: inline-block;
      white-space: nowrap;
      cursor: pointer;
      font-family: inherit;
    ">$${price}</div>`,
    iconSize: [60, 30],
    iconAnchor: [30, 15]
  });
};

export default function MapView({ listings }) {
  // Center map based on first listing or default to Mediterranean/Europe view
  const defaultCenter = listings.length > 0
    ? [listings[0].latitude, listings[0].longitude]
    : [36.4618, 25.3753];

  return (
    <div style={{ height: 'calc(100vh - 160px)', width: '100%', position: 'relative' }}>
      <MapContainer
        center={defaultCenter}
        zoom={3}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {listings.map((listing) => {
          if (!listing.latitude || !listing.longitude) return null;
          return (
            <Marker
              key={listing.id}
              position={[listing.latitude, listing.longitude]}
              icon={createPriceIcon(listing.pricePerNight)}
            >
              <Popup>
                <div style={{ width: '220px', fontFamily: 'inherit' }}>
                  <img
                    src={listing.images && listing.images[0]}
                    alt={listing.title}
                    style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 600 }}>
                    <span style={{ fontSize: '13px', color: '#222' }}>{listing.city}</span>
                    <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      ★ {listing.averageRating || 'New'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#717171', margin: '2px 0 6px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {listing.title}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700 }}>${listing.pricePerNight} <small style={{ fontWeight: 400, color: '#717171' }}>night</small></span>
                    <Link
                      to={`/listings/${listing.id}`}
                      style={{
                        background: '#FF385C',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}
                    >
                      View
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
