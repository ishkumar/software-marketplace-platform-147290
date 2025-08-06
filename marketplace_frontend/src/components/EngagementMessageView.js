import React, { useEffect, useState } from "react";

/**
 * EngagementMessageView
 * Modal/dialog to show a single engagement message with reply option (if applicable)
 * @param {object} props
 *  - message: plain object (should have id, sender_email, recipient_email, message, time_sent)
 *  - open: boolean
 *  - onClose
 *  - canReply: boolean
 *  - onReply: function(msgText)
 */
export default function EngagementMessageView({ message, open, onClose, canReply = false, onReply }) {
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");
  if (!open || !message) return null;

  const handleReply = async (e) => {
    e.preventDefault();
    setReplying(true);
    setReplyError("");
    try {
      await onReply(reply.trim());
      setReply("");
    } catch (e) {
      setReplyError(e.message || "Could not send reply");
    } finally {
      setReplying(false);
    }
  };
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(52,98,88,0.17)", zIndex: 22,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "var(--bg-secondary)", borderRadius: 13,
        minWidth: 340, maxWidth: 500, padding: "2.1rem 2.4rem",
        position: "relative", boxShadow: "0 2px 16px #567E3E24"
      }}>
        <button style={{
          position: "absolute", right: 18, top: 12, background: "transparent",
          fontSize: 22, border: "none", color: "#333", cursor: "pointer"
        }}
          onClick={onClose}
          aria-label="Close Message"
        >&times;</button>
        <h3 style={{marginTop: 0, marginBottom: 5}}>Message</h3>
        <div style={{fontSize: 15, color:"#576a49",marginBottom: 2}}>
          <span>From: <b>{message.sender_email}</b></span> <br/>
          <span>To: <b>{message.recipient_email}</b></span>
        </div>
        <div style={{fontSize: 13, color:"#777", marginBottom: 9}}>
          Sent: {message.time_sent || message.created_at}
        </div>
        <div style={{
          background: "#e9ffe2", padding: "1em", borderRadius: 7,
          marginBottom: 14, fontSize: 16, fontWeight: 500, color:"#335d15"
        }}>
          {message.message}
        </div>
        {canReply && (
          <form onSubmit={handleReply}>
            <textarea
              style={{width: "100%", minHeight: 65, marginBottom: 8, borderRadius: "7px", padding: 8}}
              maxLength={400}
              placeholder="Reply to this message"
              value={reply}
              onChange={e => setReply(e.target.value)}
              required
            />
            <div style={{display:"flex",gap: 9, alignItems:"center"}}>
              <button className="btn" type="submit" disabled={replying || reply.length < 2}>
                {replying ? "Sending..." : "Send Reply"}
              </button>
              <button className="btn" type="button" style={{background:"#eee", color:"#444"}} onClick={onClose}>Close</button>
            </div>
            {replyError && <div style={{
                background: "#fff0e4",
                color: "#c0392b",
                borderRadius: 7,
                margin: "0.7rem 0 0 0",
                padding:"0.3em 0.7em", fontSize: 13, fontWeight: 500
              }}>{replyError}</div>}
          </form>
        )}
        {!canReply && (
          <button className="btn" type="button" style={{marginTop:7, background:"#eee", color:"#444"}} onClick={onClose}>Close</button>
        )}
      </div>
    </div>
  );
}
