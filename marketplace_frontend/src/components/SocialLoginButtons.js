import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";

/**
 * SocialLoginButtons: UI buttons to initiate Google and GitHub OAuth logins.
 */
// PUBLIC_INTERFACE
export default function SocialLoginButtons() {
  const { socialLogin } = useContext(AuthContext);

  return (
    <div className="social-login-container">
      <button className="social-btn google" onClick={() => socialLogin("google")}>
        Continue with Google
      </button>
      <button className="social-btn github" onClick={() => socialLogin("github")}>
        Continue with GitHub
      </button>
    </div>
  );
}
