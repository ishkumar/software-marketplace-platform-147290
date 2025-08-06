import React, { useState } from "react";

/**
 * SearchFilter
 * Shows search input, filter dropdowns, and paid/free toggle.
 * Parents provide onSearch(filters).
 *
 * @param {object} props
 *   - options: { publishers: [], types: [] }
 *   - onSearch: (filterObj) => void
 *   - initial: {q, publisher, type, is_paid}
 */
// PUBLIC_INTERFACE
export default function SearchFilter({ options = {}, onSearch, initial = {} }) {
  const [query, setQuery] = useState(initial.q || "");
  const [publisher, setPublisher] = useState(initial.publisher || "");
  const [type, setType] = useState(initial.type || "");
  const [isPaid, setIsPaid] = useState(
    initial.is_paid === undefined ? "" : initial.is_paid
  );

  const handleSearch = e => {
    e && e.preventDefault();
    onSearch({
      q: query,
      publisher,
      type,
      is_paid: isPaid !== "" ? isPaid : undefined,
    });
  };

  return (
    <form className="search-filter" onSubmit={handleSearch}
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        background: "var(--bg-secondary)",
        borderRadius: 12,
        padding: "1rem 1.5rem",
        margin: "1.2rem 0 1.8rem 0",
      }}
    >
      <input
        type="text"
        value={query}
        placeholder="Search software..."
        onChange={e => setQuery(e.target.value)}
        style={{padding: "0.5em 1em", width: "220px", borderRadius:6}}
      />
      <select value={publisher} onChange={e => setPublisher(e.target.value)}>
        <option value="">All Publishers</option>
        {(options.publishers || []).map(pub =>
          <option key={pub} value={pub}>{pub}</option>
        )}
      </select>
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="">All Types</option>
        {(options.types || []).map(typ =>
          <option key={typ} value={typ}>{typ}</option>
        )}
      </select>
      <select value={isPaid} onChange={e => setIsPaid(e.target.value)}>
        <option value="">All</option>
        <option value="false">Free</option>
        <option value="true">Paid</option>
      </select>
      <button className="btn" type="submit" style={{padding: "0.5em 1.2em"}}>
        Search
      </button>
    </form>
  );
}
