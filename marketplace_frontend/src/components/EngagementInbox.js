import React, { useEffect, useState } from "react";

/**
 * EngagementInbox: Lists inbox/outbox engagement messages with basic read UX.
 * @param {object} props
 *  - box: 'inbox' | 'outbox'
 *  - onView: func(messageObj): open a single message view
 *  - open: boolean - show or hide
 *  - onClose: closes the drawer/modal
 */
export default function EngagementInbox({ box = "inbox", open, onView, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError("");
    fetch(`/api/engage/${box}/`, {
      headers: authHeader(),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load messages");
        return r.json();
      })
      .then((data) => {
        setMessages(data.results || data.messages || []);
      })
      .catch((e) => {
        setError(e.message || "Error loading messages");
        setMessages([]);
      })
      .finally(() => setLoading(false));
  }, [open, box]);

  function authHeader() {
    let t = localStorage.getItem("auth_token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  }

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(32,44,34,0.17)", zIndex: 20,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        position: "relative", background: "var(--bg-secondary)",
        borderRadius: 13, padding: "1.6rem 2rem 1.3rem 2rem",
        minWidth: 320, maxWidth: 450, maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 2px 16px #446E4920"
      }}>
        <button style={{
          position: "absolute", right: 22, top: 15, background: "transparent",
          fontSize: 22, border: "none", color: "#333", cursor: "pointer"
        }}
          onClick={onClose}
          aria-label="Close Inbox"
        >&times;</button>
        <h3 style={{marginBottom: 10}}>{box === "outbox" ? "Sent Messages" : "Inbox"}</h3>
        {loading && <div style={{margin: "1.4rem 0"}}>Loading...</div>}
        {error && <div style={{
          background: "#fff0e4", color: "#c0392b", borderRadius: 7,
          margin: "0.7rem 0", padding:"0.45em 0.9em", fontWeight: 500
        }}>{error}</div>}
        {(!loading && !error && messages.length === 0) && <div style={{margin:"1.1rem 0", color:"#707"}}>No messages found.</div>}
        {!loading && messages.length > 0 && (
          <ul style={{
            padding: 0, margin: 0, listStyle: "none", minWidth: "100%"
          }}>
            {messages.map(msg => (
              <li key={msg.id} style={{
                borderBottom: "1px solid #e4eaee",
                background: msg.is_unread ? "#e5f9d7" : "transparent",
                padding: "0.8em 0.2em", cursor: "pointer"
              }}
                onClick={() => onView && onView(msg)}
                tabIndex={0}
                aria-label="View message"
              >
                <div style={{fontWeight: 500, color: "#486a34", marginBottom: 2}}>
                  {box === "outbox" ? `To: ${msg.recipient_email}` : `From: ${msg.sender_email}`}
                  &nbsp; <span style={{color: "#888", fontSize: 12}}>{msg.time_sent || msg.created_at || ""}</span>
                </div>
                <div style={{fontSize: 15, color:"#333", opacity: .9 }}>
                  {msg.message.substring(0, 76)}{msg.message.length > 76 ? "..." : ""}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
