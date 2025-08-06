import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

/**
 * SignupForm: UI for user registration (manual)
 */
// PUBLIC_INTERFACE
export default function SignupForm({ onSignupSuccess }) {
  const { signup, error, setError } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signup(form);
    setLoading(false);
    if (res.success && onSignupSuccess) {
      onSignupSuccess();
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          required
          onChange={handleChange}
          autoComplete="username"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          minLength={6}
          required
          onChange={handleChange}
          autoComplete="new-password"
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <div className="auth-error">{error}</div>}
      </form>
    </div>
  );
}
