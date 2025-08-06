import React from "react";

// PUBLIC_INTERFACE
// Accessible navigation header for the marketplace.
export default function Header({ currentPage, onNavigate }) {
  return (
    <header
      className="global-header"
      style={{
        background: "linear-gradient(90deg,#a7e9af 60%,#f4f7f3 100%)",
        padding: "0.9rem 0 0.8rem 0",
        borderBottom: "1.5px solid #a7e9af",
        position: "sticky",
        top: 0,
        zIndex: 120,
        width: "100%",
        boxShadow: "0 2px 9px #a7e9af33",
      }}
      role="banner"
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 4%",
        }}
        aria-label="Main navigation"
      >
        <span
          className="app-logo"
          style={{
            fontWeight: 800,
            fontSize: 27,
            color: "#389e69",
            letterSpacing: "1.5px",
            display: "flex",
            alignItems: "center",
            gap: 9,
            userSelect: "none",
          }}
          tabIndex={0}
          aria-label="Home"
          onClick={() => onNavigate && onNavigate("marketplace")}
          role="button"
        >
          <span style={{
            background: "#3F6747",
            borderRadius: "40%",
            color: "white",
            fontWeight: 900,
            padding: "3px 8px",
            fontSize: 21,
            marginRight: 6,
            letterSpacing: ".7px"
          }}>
            S
          </span>
          Software Market
        </span>
        <ul style={{
          display: "flex",
          gap: 20,
          listStyle: "none",
          margin: 0,
          padding: 0,
          alignItems: "center",
        }}>
          <li>
            <button
              className={`nav-btn${currentPage === "marketplace" ? " active" : ""}`}
              onClick={() => onNavigate && onNavigate("marketplace")}
              style={{
                background: "transparent",
                color: "#283f30",
                fontWeight: 600,
                border: "none",
                borderBottom: currentPage === "marketplace" ? "2.5px solid #4CAF50" : "2.5px solid transparent",
                padding: "8px 10px",
                fontSize: 17,
                cursor: "pointer",
                transition: "all .19s"
              }}
            >Marketplace</button>
          </li>
          <li>
            <button
              className={`nav-btn${currentPage === "profile" ? " active" : ""}`}
              onClick={() => onNavigate && onNavigate("profile")}
              style={{
                background: "transparent",
                color: "#283f30",
                fontWeight: 600,
                border: "none",
                borderBottom: currentPage === "profile" ? "2.5px solid #386A46" : "2.5px solid transparent",
                padding: "8px 10px",
                fontSize: 17,
                cursor: "pointer",
                transition: "all .19s"
              }}
            >My Profile</button>
          </li>
          <li>
            <button
              className="nav-btn"
              onClick={() => onNavigate && onNavigate("login")}
              style={{
                background: "#73dda1",
                color: "#1a3522",
                fontWeight: 700,
                border: "none",
                borderRadius: 19,
                padding: "7px 23px",
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 2px 6px #4CAF5033",
                marginLeft: 14,
                transition: "opacity .18s"
              }}
            >Login/Sign Up</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
