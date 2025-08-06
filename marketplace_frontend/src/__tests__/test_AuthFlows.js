import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../AuthContext';
import SignupForm from '../components/SignupForm';
import LoginForm from '../components/LoginForm';

describe('Authentication Flows', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  it('SignupForm success flow', async () => {
    const signupMock = jest.fn().mockResolvedValue({ success: true });
    const errorMock = jest.fn();
    // Provide custom AuthContext for controlled test
    render(
      <AuthProvider value={{
        signup: signupMock,
        error: null,
        setError: errorMock
      }}>
        <SignupForm onSignupSuccess={signupMock} />
      </AuthProvider>
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'alice@example.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'testpass123', name: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => expect(signupMock).toHaveBeenCalled());
  });

  it('LoginForm failed login shows error', async () => {
    const loginMock = jest.fn().mockResolvedValue({ success: false, error: 'Invalid credentials' });
    const errorMock = jest.fn();
    render(
      <AuthProvider value={{
        login: loginMock,
        error: 'Invalid credentials',
        setError: errorMock
      }}>
        <LoginForm onLoginSuccess={jest.fn()} />
      </AuthProvider>
    );
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'bob@x.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrong', name: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() => expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument());
  });
});
