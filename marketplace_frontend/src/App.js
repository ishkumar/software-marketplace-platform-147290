import React, { useState, useEffect, useContext } from 'react';
import logo from './logo.svg';
import './App.css';

// Auth UI and context
import { AuthProvider, AuthContext } from './AuthContext';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import SocialLoginButtons from './components/SocialLoginButtons';
import AuthStatus from './components/AuthStatus';
import ListingsPage from './components/ListingsPage';

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
      <>
        <ListingsPage />
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
      </>
    );
  }

  return (
    <>
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
      <p>
        Current theme: <strong>{theme}</strong>
      </p>
    </>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [page, setPage] = useState('login'); // "login", "signup", "marketplace", or "profile"
  const [redirected, setRedirected] = useState(false);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Detect OAuth redirect from backend
  useEffect(() => {
    // Example: backend redirects to /?token=xxx after OAuth
    const params = new URLSearchParams(window.location.search);
    if (params.has('token')) {
      localStorage.setItem('auth_token', params.get('token'));
      setRedirected(true);
      setPage("marketplace");
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <img src={logo} className="App-logo" alt="logo" />
          <AuthStatus />
          <MainContent page={page} setPage={setPage} theme={theme} />
        </header>
      </div>
    </AuthProvider>
  );
}

export default App;
