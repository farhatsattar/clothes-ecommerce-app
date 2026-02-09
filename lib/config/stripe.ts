import { loadEnvConfig } from '@next/env';

// Load environment variables
loadEnvConfig(process.cwd());

// Get Stripe secret key from environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Stripe secret key is not defined in environment variables');
}

export { stripeSecretKey };