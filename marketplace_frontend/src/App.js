import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider, AuthContext } from './AuthContext';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import SocialLoginButtons from './components/SocialLoginButtons';
import AuthStatus from './components/AuthStatus';
import ListingsPage from './components/ListingsPage';
import EngagementInbox from './components/EngagementInbox';
import EngagementMessageView from './components/EngagementMessageView';

// Simple navigation for auth flows
function Navigation({ currentPage, setPage }) {
  return (
    <nav className="auth-nav">
      <button
        className={`btn ${currentPage === 'login' ? 'active' : ''}`}
        onClick={() => setPage('login')}
      >
        Login
      </button>
      <button
        className={`btn ${currentPage === 'signup' ? 'active' : ''}`}
        onClick={() => setPage('signup')}
      >
        Sign Up
      </button>
    </nav>
  );
}

function MainContent({ page, setPage, theme }) {
  const { isAuthenticated } = useContext(AuthContext);

  // Once authenticated, show ListingsPage as main content
  if (isAuthenticated || page === "marketplace" || page === "profile") {
    return (
      <main aria-label="Marketplace Main Content" tabIndex={-1} style={{ outline: "none" }}>
        <ListingsPage />
      </main>
    );
  }

  // Auth flows
  return (
    <main aria-label="Auth Main Content" tabIndex={-1} style={{ outline: "none" }}>
      <Navigation currentPage={page} setPage={setPage} />
      {page === "login" ? (
        <>
          <LoginForm onLoginSuccess={() => { setPage("marketplace"); }} />
          <SocialLoginButtons />
        </>
      ) : (
        <>
          <SignupForm onSignupSuccess={() => { setPage("marketplace"); }} />
          <SocialLoginButtons />
        </>
      )}
    </main>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [page, setPage] = useState("login");
  const [redirected, setRedirected] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [boxType, setBoxType] = useState("inbox");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [notify, setNotify] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("token")) {
      localStorage.setItem("auth_token", params.get("token"));
      setRedirected(true);
      setPage("marketplace");
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const toggleTheme = () =>
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));

  function handleMsgView(msg) {
    setSelectedMsg(msg);
    setShowMsgModal(true);
  }

  async function handleMsgReply(text) {
    try {
      let resp = await fetch("/api/engage/reply/", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + (localStorage.getItem("auth_token") || ""),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engagement_id: selectedMsg.id,
          message: text,
        }),
      });
      if (!resp.ok)
        throw new Error((await resp.json()).detail || "Reply failed");
      setNotify("Reply sent!");
      setShowMsgModal(false);
      setShowInbox(false);
    } catch (e) {
      throw new Error(e.message || "Reply failed");
    }
  }

  const { isAuthenticated } = useContext(AuthContext);

  // App layout adds navigation header/footer and theme button
  return (
    <AuthProvider>
      <div className="App" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header currentPage={page} onNavigate={setPage} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            margin: 0,
            position: "relative",
          }}
        >
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            style={{
              position: "absolute",
              top: 20,
              right: 18,
              background: "#f4d35e",
              color: "#37430c",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              zIndex: 90,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
              opacity: 0.96,
              transition: "opacity 0.2s"
            }}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <AuthStatus />
          <MainContent page={page} setPage={setPage} theme={theme} />
          {/* Engagement inbox */}
          {isAuthenticated && (
            <div
              style={{
                position: "fixed",
                bottom: 32,
                right: 32,
                zIndex: 30,
                display: "flex",
                flexDirection: "column",
                gap: 9,
              }}
            >
              <button
                className="btn"
                style={{
                  background: "#a7e9af",
                  color: "#236620",
                  padding: "0.9em 2em",
                  fontWeight: 700,
                  fontSize: 18,
                  borderRadius: 35,
                  boxShadow: "0 3px 16px #73dda133",
                }}
                onClick={() => {
                  setBoxType("inbox");
                  setShowInbox(true);
                }}
              >
                📬 Inbox
              </button>
              <button
                className="btn"
                style={{
                  background: "#f4d35e",
                  color: "#562e1a",
                  padding: "0.5em 1.6em",
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 999,
                }}
                onClick={() => {
                  setBoxType("outbox");
                  setShowInbox(true);
                }}
              >
                Sent
              </button>
            </div>
          )}
          <EngagementInbox
            box={boxType}
            open={showInbox}
            onView={handleMsgView}
            onClose={() => setShowInbox(false)}
          />
          <EngagementMessageView
            message={selectedMsg}
            open={showMsgModal}
            onClose={() => setShowMsgModal(false)}
            canReply={boxType === "inbox"}
            onReply={handleMsgReply}
          />
          {/* Notification overlay */}
          {notify && (
            <div
              style={{
                position: "fixed",
                top: 19,
                left: "55%",
                background: "#f4d35e",
                color: "#37430c",
                borderRadius: 10,
                fontWeight: 700,
                padding: "0.7em 1.5em",
                zIndex: 40,
                boxShadow: "0 2px 12px #f4d35e44"
              }}
              role="alert"
              aria-live="polite"
            >
              {notify}
              <button
                style={{
                  marginLeft: 7,
                  background: "transparent",
                  color: "#123",
                  border: "none",
                  fontSize: 17,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
                aria-label="Close notification"
                onClick={() => setNotify("")}
              >
                &times;
              </button>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
