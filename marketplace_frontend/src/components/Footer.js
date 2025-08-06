import React from "react";

// PUBLIC_INTERFACE
// Global footer with pastel accents and accessibility.
export default function Footer() {
  return (
    <footer
      className="global-footer"
      style={{
        background: "linear-gradient(90deg,#f4f7f3 0%, #a7e9af 80%)",
        borderTop: "1.5px solid #a7e9af",
        padding: "1.1rem 0 0.8rem 0",
        fontSize: 16,
        color: "#417a53",
        textAlign: "center",
        width: "100%",
        marginTop: "2em",
        letterSpacing: ".03rem",
      }}
      role="contentinfo"
    >
      <span>
        &copy; {new Date().getFullYear()} Software Market &middot; 
        <a href="https://github.com/" aria-label="GitHub profile" style={{
            color: "#3E6247", textDecoration: "none", fontWeight: 500, marginLeft: 8
          }}>GitHub</a>
      </span>
      <span style={{marginLeft: 18, fontSize: 14, color: "#82bc9a"}}>
        Crafted with <span aria-label="love">💚</span> in pastel green.
      </span>
    </footer>
  );
}
