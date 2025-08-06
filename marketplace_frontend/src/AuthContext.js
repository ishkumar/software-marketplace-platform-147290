import React, { createContext, useState, useEffect } from "react";

/**
 * AuthContext provides authentication state and operations for use in the app.
 * Structure: { user, isAuthenticated, login, logout, signup, socialLogin }
 */

// PUBLIC_INTERFACE
export const AuthContext = createContext();

/**
 * AuthProvider wraps children and provides authentication logic (fetches user, manages JWT, etc).
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null or user object
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // to gate fetching user profile
  const [error, setError] = useState(null);

  // Helper to get token from localStorage
  function getToken() {
    return localStorage.getItem("auth_token");
  }

  // Load user on init (if token exists)
  useEffect(() => {
    // Try to fetch current profile (if token)
    const token = getToken();
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }
    // Fetch user profile from backend API, auth required
    fetch("/api/user/profile/", {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to fetch user");
        return await r.json();
      })
      .then((data) => {
        setUser(data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // PUBLIC_INTERFACE
  const login = async ({ email, password }) => {
    setError(null);
    try {
      const response = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Login failed");
      }
      const data = await response.json();
      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // PUBLIC_INTERFACE
  const signup = async ({ email, password }) => {
    setError(null);
    try {
      const response = await fetch("/api/auth/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Signup failed");
      }
      const data = await response.json();
      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // PUBLIC_INTERFACE (logout)
  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // PUBLIC_INTERFACE (social)
  const socialLogin = (provider) => {
    // provider = "google" | "github"
    window.location.href = `/api/auth/oauth/${provider}/login/`;
    // Backend should handle the OAuth redirect and then return with token set (or via a callback/redirect)
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      error,
      login,
      signup,
      logout,
      socialLogin,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};
