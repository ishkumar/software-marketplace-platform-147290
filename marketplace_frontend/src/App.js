import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

// Auth UI and context
import { AuthProvider } from './AuthContext';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import SocialLoginButtons from './components/SocialLoginButtons';
import AuthStatus from './components/AuthStatus';

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

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [page, setPage] = useState('login'); // "login" or "signup"
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
          {/* Show auth navigation only if not authenticated */}
          <Navigation currentPage={page} setPage={setPage} />
          {page === "login" ? (
            <>
              <LoginForm onLoginSuccess={() => { setPage("profile"); }} />
              <SocialLoginButtons />
            </>
          ) : (
            <>
              <SignupForm onSignupSuccess={() => { setPage("profile"); }} />
              <SocialLoginButtons />
            </>
          )}
          <p>
            Current theme: <strong>{theme}</strong>
          </p>
        </header>
      </div>
    </AuthProvider>
  );
}

export default App;
