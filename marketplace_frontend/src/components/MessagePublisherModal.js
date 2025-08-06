import React, { useState } from "react";

/**
 * MessagePublisherModal
 * Shows modal for user to send message/engagement to publisher.
 * @param {object} props
 *  - open: bool
 *  - onClose: () => void
 *  - onSend: (msgText) => void
 *  - loading: bool
 */
// PUBLIC_INTERFACE
export default function MessagePublisherModal({ open, onClose, onSend, loading }) {
  const [text, setText] = useState("");
  if (!open) return null;

  const handleSubmit = e => {
    e.preventDefault();
    if (text.trim().length > 0) {
      onSend(text.trim());
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(36,56,36,0.27)',
      zIndex: 9,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 12,
        padding: '2rem 2.2rem',
        minWidth: 310, maxWidth: 370,
        boxShadow: "0 2px 16px #426E4E22"
      }}>
        <button style={{
          position: "absolute", right: 35, top: 15, background: "transparent",
          fontSize: 22, border: "none", color: "#333", cursor: "pointer"
        }}
        onClick={onClose}
        >&times;</button>
        <h3>Contact Publisher</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            rows={6}
            value={text}
            maxLength={490}
            style={{width: "100%", marginTop: 5, marginBottom: 15, borderRadius: 7, padding: 8}}
            placeholder="Write your message/request (max 490 characters)?"
            onChange={e => setText(e.target.value)}
            required
          />
          <div style={{display:"flex", gap: 10, justifyContent:"flex-end"}}>
            <button
              className="btn"
              type="button"
              style={{background:"#AAA",color:"#132"}} onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn"
              type="submit"
              disabled={loading || text.length < 2}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
