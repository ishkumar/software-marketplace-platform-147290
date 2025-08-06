import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";

/**
 * AuthStatus: Shows user authentication state and logout action.
 */
// PUBLIC_INTERFACE
export default function AuthStatus() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  if (!isAuthenticated)
    return null;

  return (
    <div className="auth-status">
      Logged in as <strong>{user?.email || "User"}</strong>
      <button className="btn logout-btn" onClick={logout}>Logout</button>
    </div>
  );
}
