# `@ordnary/pay-sdk`

Safe public client SDK for `Ordnary Pay`.

This package is intentionally limited to browser-safe and app-safe operations:

- reading payment-method overview
- creating a setup intent through your Ordnary backend
- syncing a confirmed payment method
- setting a default payment method
- removing a payment method

It does **not** contain:

- Stripe secret keys
- Stripe webhook logic
- direct charge creation with privileged credentials
- any embedded private Ordnary infrastructure secrets

## Install

```bash
npm install @ordnary/pay-sdk
```

For local development in this workspace:

```bash
npm install ../ordnary.pay-sdk
```

## Safety Model

Publishing this package publicly is safe **if** you keep these boundaries:

- never ship `STRIPE_SECRET_KEY` or webhook secrets to the browser
- never put privileged payment creation or refund logic in this package
- only call your own authenticated Ordnary backend routes from the SDK
- enforce auth, step-up, rate limits, and audit logging on the server

In other words: public npm package is fine; public secrets are not.

## Usage

```ts
import { createOrdnaryPayClient } from "@ordnary/pay-sdk";

const pay = createOrdnaryPayClient({
  baseUrl: "https://accounts.ordnary.com",
  getHeaders: async () => ({
    "x-csrf-token": getCsrfToken(),
  }),
});

const overview = await pay.getPaymentsOverview();
const setupIntent = await pay.createSetupIntent();
```

## Example Flow

```ts
const pay = createOrdnaryPayClient({
  baseUrl: "https://accounts.ordnary.com",
  getHeaders: () => ({
    "x-csrf-token": getCsrfToken(),
  }),
});

const { clientSecret, publishableKey } = await pay.createSetupIntent();

// Use Stripe.js in your app to confirm the setup intent with the client secret.
// After Stripe confirmation succeeds:

await pay.syncPaymentMethod({
  setupIntentId: "seti_...",
  makeDefault: true,
});
```

## Recommended Architecture

- Browser/app:
  uses `@ordnary/pay-sdk` and Stripe.js publishable key only
- Ordnary backend:
  owns Stripe secret key, webhook verification, customer creation, sync rules
- Stripe:
  handles card entry, 3DS, network tokenization, and setup intent confirmation

## What To Avoid

- Do not add refund endpoints here with admin credentials
- Do not add raw Stripe secret-key wrappers to this package
- Do not expose internal customer IDs unless required
- Do not trust client-side billing/profile claims without server validation
