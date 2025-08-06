import React from 'react';
import ListingCard from './ListingCard';

// PUBLIC_INTERFACE
export default function ListingsGrid({ listings, onLike, onUnlike, onEngage, onEdit }) {
  // listings: Array of listing objects
  if (!listings || listings.length === 0) {
    return <div style={{margin: '2rem auto', color: '#AAA'}}>No listings found.</div>;
  }
  return (
    <div className="listings-grid"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.5rem',
        justifyContent: 'center'
      }}
    >
      {listings.map(listing =>
        <ListingCard
          key={listing.id}
          listing={listing}
          onLike={onLike}
          onUnlike={onUnlike}
          onEngage={onEngage}
          onEdit={onEdit}
        />
      )}
    </div>
  );
}
