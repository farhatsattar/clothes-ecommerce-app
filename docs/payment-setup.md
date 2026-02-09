# Payment Gateway Setup Guide

## Stripe Integration

To enable payment processing in your ecommerce app, you need to configure Stripe with your account details.

### 1. Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign in or create an account
3. Navigate to Developers > API Keys
4. Copy your:
   - Publishable key (starts with `pk_test_` or `pk_live_`)
   - Secret key (starts with `sk_test_` or `sk_live_`)

### 2. Configure Environment Variables

Update your `.env.local` file with your Stripe keys:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 3. Enable Payment Methods in Stripe

1. In your Stripe Dashboard, go to Settings > Payment methods
2. Enable the payment methods you want to accept (Cards, Apple Pay, Google Pay, etc.)
3. Make sure to enable them for both test and live modes as needed

### 4. Test Your Integration

1. For testing, you can use Stripe's test card numbers:
   - `4242 4242 4242 4242` - Standard test card
   - `4000 0566 5566 5556` - Declined card for testing failures

2. Make sure to toggle Stripe to test mode during development

### 5. Go Live

When you're ready to accept real payments:

1. Switch your Stripe account to live mode
2. Update your environment variables with live keys
3. Remove test card numbers and ensure proper validation
4. Update the payment methods in your app to reflect what you've enabled in your Stripe dashboard

### 6. Webhook Setup (Future Enhancement)

For production, you'll want to set up webhooks to handle payment events:

1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events to listen for (payment_intent.succeeded, payment_intent.payment_failed, etc.)

## Supported Payment Methods

Currently implemented:
- Cash on Delivery (COD)
- Credit/Debit Cards via Stripe

Future enhancements could include:
- Apple Pay
- Google Pay
- Bank transfers
- Digital wallets (PayPal, etc.)