import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

/**
 * PaymentModal handles Stripe Checkout session for a paid listing.
 * @param {object} props
 *  - open: bool
 *  - onClose: () => void
 *  - listing: the listing object (id, title, price, etc)
 *  - getAuthHeader: () => object
 *  - onPaymentResult: (result) => void
 */
export default function PaymentModal({ open, onClose, listing, getAuthHeader, onPaymentResult }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    if (!stripe) {
      const key = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
      if (!key) setError("Stripe key missing. Payment unavailable.");
      else loadStripe(key).then(s => setStripe(s));
    }
  }, [stripe]);

  if (!open) return null;
  if (!listing) return null;

  const handleCheckout = async () => {
    setLoading(true); setError("");
    try {
      const resp = await fetch("/api/purchase/checkout/", {
        method: "POST",
        headers: { ...getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listing.id }),
      });
      if (!resp.ok) {
        let err;
        try { err = (await resp.json()).detail || "Request error"; } catch { err = "Request error"; }
        throw new Error(err);
      }
      const { session_id } = await resp.json();
      if (!session_id) throw new Error("Stripe session not received.");
      if (!stripe) throw new Error("Stripe object not loaded.");
      const { error: stripeErr } = await stripe.redirectToCheckout({ sessionId: session_id });
      if (stripeErr) throw new Error(stripeErr.message);
      onPaymentResult({ status: "redirecting" });
    } catch (e) {
      setError(e.message || "Unable to start payment. Try again.");
      onPaymentResult({ status: "error", error: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(36,56,36,0.23)', zIndex: 15,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 16,
        padding: '2.2rem 2.4rem',
        minWidth: 320, maxWidth: 410,
        boxShadow: "0 2px 16px #426E4E28",
        position: "relative"
      }}>
        <button style={{
          position: "absolute", right: 22, top: 14, background: "transparent",
          fontSize: 22, border: "none", color: "#333", cursor: "pointer"
        }}
          onClick={onClose}
          aria-label="Close Payment Modal"
          disabled={loading}
        >&times;</button>
        <h3 style={{ marginBottom: 14 }}>Purchase <span style={{color:"#4CAF50"}}>{listing.title}</span></h3>
        <p style={{ marginBottom: 10 }}>Confirm your purchase of this software via Stripe.</p>
        <div style={{fontSize:18, marginBottom:16}}>
          <span>Price: </span>
          <span style={{color: "#f4d35e", fontWeight: 600}}>${listing.price}</span>
        </div>
        <button
          className="btn"
          style={{padding:"0.7rem 1.7rem", fontWeight:700, fontSize:17 }}
          onClick={handleCheckout}
          disabled={loading || !stripe}
        >
          {loading ? "Processing..." : "Pay with Card"}
        </button>
        {error && (
          <div style={{
            background: "#fff0e4",
            color: "#c0392b",
            borderRadius: 7,
            margin: "0.9rem 0 0 0",
            padding:"0.4em 0.7em",
            fontSize: 15,
            fontWeight: 500
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
