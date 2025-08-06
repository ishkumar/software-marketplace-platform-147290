import React, { useEffect, useState, useContext } from "react";
import {
  ListingsGrid, ListingForm,
  SearchFilter, MessagePublisherModal,
} from "./index";
import { AuthContext } from "../AuthContext";

/**
 * ListingsPage
 * Marketplace browse, search, and engagement flows.
 * Handles search/filter UI, displays listings, allows like/message, handles listing create/edit forms.
 */
// PUBLIC_INTERFACE
export default function ListingsPage() {
  const { isAuthenticated, user } = useContext(AuthContext);

  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({}); // q, publisher, type, is_paid
  const [options, setOptions] = useState({ publishers: [], types: [] });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [messageId, setMessageId] = useState(null);
  const [msgModalOpen, setMsgModalOpen] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState("");

  // Fetch marketplace listings (with filters)
  useEffect(() => {
    let url = "/api/marketplace/?";
    let qs = [];
    if (filters.q) qs.push("q=" + encodeURIComponent(filters.q));
    if (filters.publisher) qs.push("publisher=" + encodeURIComponent(filters.publisher));
    if (filters.type) qs.push("type=" + encodeURIComponent(filters.type));
    if (filters.is_paid !== undefined && filters.is_paid !== "") qs.push("is_paid=" + filters.is_paid);
    url += qs.join("&");
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setListings(data.listings || data.results || []);
        setOptions({
          publishers: data.publishers || [],
          types: data.types || [],
        });
      });
  }, [filters, showForm]); // showForm in dep (for update after save)

  // Handle like/unlike listing
  const handleLike = id => {
    fetch(`/api/likes/${id}/`, {
      method: "POST",
      headers: authHeader()
    }).then(r => {
      if (r.ok) updateListingLikes(id, 1);
    });
  };
  const handleUnlike = id => {
    fetch(`/api/likes/${id}/`, {
      method: "DELETE",
      headers: authHeader()
    }).then(r => {
      if (r.ok) updateListingLikes(id, -1);
    });
  };

  function updateListingLikes(id, delta) {
    setListings(listings =>
      listings.map(lst =>
        lst.id === id
          ? { ...lst, like_count: Math.max((lst.like_count??0)+delta,0), liked: !lst.liked }
          : lst
      )
    );
  }

  // Create new listing
  const handleListingSubmit = data => {
    setFormLoading(true);
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/listings/${editing.id}/` : "/api/listings/";
    fetch(url, {
      method,
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).detail || "Error");
        return r.json();
      })
      .then(listing => {
        setShowForm(false);
        setEditing(null);
        setFormLoading(false);
        setFilters({ ...filters }); // refresh
      })
      .catch(e => {
        alert("Error: " + e.message);
        setFormLoading(false);
      });
  };

  // Edit
  const handleEdit = id => {
    const lst = listings.find(l => l.id === id);
    if (lst) {
      setEditing(lst);
      setShowForm(true);
    }
  };

  // Messaging
  const handleEngage = id => {
    setMessageId(id);
    setMsgModalOpen(true);
    setMsgSuccess("");
    setMsgLoading(false);
  };
  const handleSendMsg = msgText => {
    setMsgLoading(true);
    fetch(`/api/engage/`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id: messageId, message: msgText })
    })
      .then(async r => {
        if (!r.ok) throw new Error("Failed to send message");
        return r.json();
      })
      .then(() => {
        setMsgSuccess("Message sent!");
        setMsgModalOpen(false);
        setMsgLoading(false);
      })
      .catch(() => {
        alert("Error sending message");
        setMsgLoading(false);
      });
  };

  function authHeader() {
    let t = localStorage.getItem("auth_token");
    return t ? { Authorization: `Bearer ${t}` } : {};
  }

  return (
    <div className="marketplace-main" style={{padding:"1.2rem 0 2.5rem 0"}}>
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems: "center", flexWrap: "wrap",
        padding: "0 4%",
        marginBottom: 12
      }}>
        <h2 style={{color: "#3F6747"}}>Marketplace</h2>
        {isAuthenticated && (
          <button className="btn"
            style={{background:'#73dda1'}}
            onClick={() => {
              setShowForm(true);
              setEditing(null);
            }}>
            + Submit New Listing
          </button>
        )}
      </div>
      <SearchFilter options={options} onSearch={setFilters} />
      {showForm && (
        <ListingForm
          initial={editing}
          onSubmit={handleListingSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          submitLabel={editing ? "Update" : "Submit"}
          loading={formLoading}
        />
      )}
      <ListingsGrid
        listings={listings.map(l => ({
          ...l,
          is_publisher: isAuthenticated && user && user.id === l.publisher_id, // publisher see edit button
        }))}
        onLike={handleLike}
        onUnlike={handleUnlike}
        onEngage={handleEngage}
        onEdit={handleEdit}
      />
      <MessagePublisherModal
        open={msgModalOpen}
        onClose={() => setMsgModalOpen(false)}
        onSend={handleSendMsg}
        loading={msgLoading}
      />
      {msgSuccess && <div style={{
        background:"#f4d35e",
        color:"#2e362a",
        fontWeight: 500,
        margin: "1rem auto", width:"max-content", borderRadius:8, padding: '0.5em 1.5em'
      }}>{msgSuccess}</div>}
    </div>
  );
}
