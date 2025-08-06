import React from 'react';

/**
 * ListingCard: Displays details for a single software listing.
 * Shows like count, like/unlike, and engagement button.
 * @param {object} props
 *  - listing: {id, title, summary, type, author, like_count, liked, is_publisher, is_paid}
 *  - onLike, onUnlike: (id) => void
 *  - onEngage: (id) => void
 *  - onEdit: (id) => void (optional)
 */
 // PUBLIC_INTERFACE
export default function ListingCard({ listing, onLike, onUnlike, onEngage, onEdit }) {
  return (
    <div className="listing-card" style={{
      background: 'var(--bg-secondary)',
      borderRadius: '12px',
      padding: '1.2rem 1.4rem',
      boxShadow: '0 2px 8px rgba(72,112,72, 0.08)',
      marginBottom: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      border: '1px solid var(--border-color)',
      position: 'relative',
      minWidth: 275,
      maxWidth: 350,
    }}>
      <h3 style={{marginBottom: 4}}>
        <span style={{
          color: '#4CAF50', fontWeight: 'bold'
        }}>
          {listing.title}
        </span>
      </h3>
      <div style={{fontSize: 13, color: 'var(--text-secondary)', marginBottom: 5}}>
        <span>By: {listing.author}</span> &nbsp; | &nbsp; <span>Type: {listing.type}</span>
        {listing.is_paid && <span style={{marginLeft: 10, color: '#f4d35e'}}>PAID</span>}
      </div>
      <p style={{marginTop: 0, fontSize: 15}}>{listing.summary}</p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginTop: 'auto'
      }}>
        <LikeButton
          liked={listing.liked}
          likeCount={listing.like_count}
          onLike={() => onLike(listing.id)}
          onUnlike={() => onUnlike(listing.id)}
        />
        <button
          className="btn"
          style={{background: 'var(--button-bg)', color: 'var(--button-text)', padding: '0.4rem 1.2rem'}}
          onClick={() => onEngage(listing.id)}
        >
          Engage
        </button>
        {listing.is_publisher && (
          <button
            className="btn"
            style={{background: '#a7e9af', marginLeft: 6, color: '#123708'}}
            onClick={() => onEdit(listing.id)}
            title="Edit Listing"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

// LikeButton as a sub-component
export function LikeButton({ liked, likeCount, onLike, onUnlike }) {
  return (
    <button
      className="btn"
      style={{
        background: liked ? "#4CAF50" : "#fefefe",
        color: liked ? "#fff" : "#263024",
        border: liked ? "none" : "1.5px solid #aaa",
        fontWeight: 700,
        padding: "0.37rem 1rem",
        borderRadius: "8px",
        fontSize: 15,
      }}
      onClick={liked ? onUnlike : onLike}
      aria-label={liked ? "Unlike": "Like"}
      >
      {liked ? "♥" : "♡"} {likeCount}
    </button>
  );
}
