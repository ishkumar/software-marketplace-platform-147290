import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

/**
 * LoginForm: UI for manual email/password login.
 */
// PUBLIC_INTERFACE
export default function LoginForm({ onLoginSuccess }) {
  const { login, error, setError } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(form);
    setLoading(false);
    if (res.success && onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="auth-container">
      <h2>Log In</h2>
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
          autoComplete="current-password"
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
        {error && <div className="auth-error">{error}</div>}
      </form>
    </div>
  );
}
