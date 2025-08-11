import React from "react";

// PUBLIC_INTERFACE
function SocialLoginButtons() {
  function handleSocialLogin(provider) {
    // The backend is configured to handle /accounts/<provider>/login/
    window.location.href = `/social/login/${provider}/`;
  }
  return (
    <div style={{ margin: "1.5em 0", display: "flex", flexDirection: "column", gap: 8 }}>
      <button
        className="btn"
        style={{ background: "#4285F4", color: "white" }}
        onClick={() => handleSocialLogin("google")}
      >
        Continue with Google
      </button>
      <button
        className="btn"
        style={{ background: "#24292e", color: "white" }}
        onClick={() => handleSocialLogin("github")}
      >
        Continue with GitHub
      </button>
      <button
        className="btn"
        style={{ background: "#3b5998", color: "white" }}
        onClick={() => handleSocialLogin("facebook")}
      >
        Continue with Facebook
      </button>
      <button
        className="btn"
        style={{ background: "#2867B2", color: "white" }}
        onClick={() => handleSocialLogin("linkedin")}
      >
        Continue with LinkedIn
      </button>
    </div>
  );
}

export default SocialLoginButtons;
