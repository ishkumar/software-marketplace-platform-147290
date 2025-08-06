import React, { useState, useEffect } from 'react';

/**
 * ListingForm
 * Allows publisher to create or edit a software listing.
 * @param {object} props
 *    - initial (object | null): existing listing data (for edit mode).
 *    - onSubmit: (formData) => void
 *    - onCancel: () => void
 *    - submitLabel: string
 *    - loading: bool
 * Usage:
 *   <ListingForm onSubmit={...} />
 */
// PUBLIC_INTERFACE
export default function ListingForm({ initial, onSubmit, onCancel, submitLabel = "Submit", loading }) {
  const defaultForm = {
    title: "",
    summary: "",
    type: "",
    link: "",
    is_paid: false,
    price: "",
  };
  const [form, setForm] = useState(initial || defaultForm);
  useEffect(() => {
    setForm(initial || defaultForm);
  }, [initial]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f =>
      ({ ...f, [name]: type === "checkbox" ? checked : value })
    );
  };
  // price field only enabled if paid is checked

  const handleSubmit = e => {
    e.preventDefault();
    let data = { ...form, price: form.is_paid ? form.price : "0" };
    onSubmit(data);
  };

  return (
    <form className="listing-form" onSubmit={handleSubmit} style={{
      background: 'var(--bg-secondary)',
      borderRadius: 10,
      padding: '2rem 2.5rem 1.3rem 2.5rem',
      width: '100%',
      maxWidth: 380,
      margin: '1.7rem auto',
      boxShadow: "0 2px 10px rgba(56,123,97,.08)"
    }}>
      <h2>{initial ? "Edit" : "Submit"} Listing</h2>
      <label>
        Title<br />
        <input type="text" name="title" value={form.title} required maxLength={60}
          onChange={handleChange} autoFocus style={{padding: "0.6em", marginBottom:10, width: "100%"}} />
      </label>
      <label>
        Summary<br />
        <textarea name="summary" value={form.summary} required maxLength={220}
          style={{width:"100%", minHeight:70, resize:"vertical", padding:"0.6em", marginBottom:10}}
          onChange={handleChange}
        ></textarea>
      </label>
      <label>
        Type<br />
        <input type="text" name="type" value={form.type} required maxLength={36}
          onChange={handleChange} style={{padding: "0.6em", marginBottom:10, width: "100%"}} />
      </label>
      <label>
        Link (demo or main site) <br/>
        <input type="text" name="link" value={form.link}
          required
          maxLength={150}
          onChange={handleChange} style={{padding: "0.6em", marginBottom:10, width: "100%"}} />
      </label>
      <label style={{marginTop: 6}}>
        <input
          type="checkbox"
          name="is_paid"
          checked={form.is_paid}
          onChange={handleChange}
          style={{marginRight: 6}}
        />
        Paid listing?
      </label>
      {form.is_paid && (
        <label>
          &nbsp;&nbsp;Price (USD)
          <input type="number" name="price" min={0} step={.01}
            value={form.price}
            onChange={handleChange}
            required={form.is_paid}
            style={{marginLeft: 6, width:"65%"}}
          />
        </label>
      )}
      <div style={{marginTop: 18, display:"flex", gap:10}}>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </button>
        {onCancel &&
          (<button className="btn" type="button" style={{background:"#e6e6e6",color:"#222"}}
            onClick={onCancel}>Cancel</button>)
        }
      </div>
    </form>
  );
}
