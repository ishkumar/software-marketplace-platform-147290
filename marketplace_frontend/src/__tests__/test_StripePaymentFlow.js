import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaymentModal from '../components/PaymentModal';

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn().mockResolvedValue({
    redirectToCheckout: jest.fn().mockResolvedValue({ error: undefined })
  })
}));

describe('Stripe PaymentModal integration', () => {
  beforeEach(() => {
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY = 'pk_test_xxx';
    jest.resetAllMocks();
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url === '/api/purchase/checkout/') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ session_id: "sess_1" }) });
      }
      return Promise.resolve({ ok: false, json: () => Promise.resolve({ detail: "Nope" }) });
    });
  });

  it('Initiates Stripe checkout with payment modal', async () => {
    render(
      <PaymentModal
        open={true}
        onClose={jest.fn()}
        listing={{ id: 1, title: "Premium App", price: "5.99" }}
        getAuthHeader={() => ({ Authorization: 'Bearer tok' })}
        onPaymentResult={jest.fn()}
      />
    );
    expect(screen.getByText(/purchase/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/pay with card/i));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/purchase/checkout/', expect.anything()));
  });
});
