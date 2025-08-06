import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListingsPage from '../components/ListingsPage';
import { AuthContext } from '../AuthContext';

function mockMarketData() {
  return {
    listings: [
      {
        id: 1,
        title: "Cool App",
        summary: "A cool description.",
        type: "utility",
        author: "alice@app.com",
        publisher_id: 100,
        is_paid: false,
        liked: false,
        like_count: 2
      }
    ],
    publishers: ["alice@app.com"],
    types: ["utility"],
  }
}

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation((url) => {
    if (url.startsWith('/api/marketplace')) {
      return Promise.resolve({ json: () => Promise.resolve(mockMarketData()) });
    }
    if (url.startsWith('/api/likes/1/')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) });
    }
    if (url.startsWith('/api/listings/')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 2, title: 'New Listing' }) });
    }
    if (url.startsWith('/api/engage/')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }
    return Promise.resolve({ ok: false, json: () => Promise.resolve({ detail: "Error" }) });
  });
  localStorage.clear();
});

afterEach(() => {
  global.fetch.mockRestore();
});

describe('Marketplace listings flows', () => {
  it('Renders listings, search, and can like/unlike', async () => {
    render(<AuthContext.Provider value={{ isAuthenticated: true, user: { id: 100 } }}><ListingsPage /></AuthContext.Provider>);
    await waitFor(() => screen.getByText(/marketplace/i));
    expect(screen.getByText(/cool app/i)).toBeInTheDocument();
    // Like a listing
    fireEvent.click(screen.getByLabelText('Like'));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/likes/1/', expect.anything()));
  });

  it('Can open listing creation form and submit', async () => {
    render(<AuthContext.Provider value={{ isAuthenticated: true, user: { id: 100 } }}><ListingsPage /></AuthContext.Provider>);
    fireEvent.click(screen.getByText(/\+ submit new listing/i));
    await waitFor(() => screen.getByPlaceholderText(/title/i));
    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: "Test Listing", name: "title" } });
    fireEvent.change(screen.getByPlaceholderText(/summary/i), { target: { value: "Desc", name: "summary" } });
    fireEvent.change(screen.getByPlaceholderText(/type/i), { target: { value: "TypeX", name: "type" } });
    fireEvent.change(screen.getByPlaceholderText(/link/i), { target: { value: "http://x.com", name: "link" } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/listings/', expect.anything()));
  });

  it('Search/filter updates listings', async () => {
    render(<AuthContext.Provider value={{ isAuthenticated: true, user: { id: 100 } }}><ListingsPage /></AuthContext.Provider>);
    await waitFor(() => screen.getByText(/marketplace/i));
    fireEvent.change(screen.getByPlaceholderText(/search software/i), { target: { value: "Cool" } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    // Marketplace API called with filtered search
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/marketplace/?q=Cool'), expect.anything()));
  });

  it('Can trigger engagement modal/message send', async () => {
    render(<AuthContext.Provider value={{ isAuthenticated: true, user: { id: 100 } }}><ListingsPage /></AuthContext.Provider>);
    await waitFor(() => screen.getByText(/engage/i));
    fireEvent.click(screen.getByText(/engage/i));
    await waitFor(() => screen.getByPlaceholderText(/write your message/i));
    fireEvent.change(screen.getByPlaceholderText(/write your message/i), { target: { value: "Hello publisher!" } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/engage/', expect.anything()));
  });
});
