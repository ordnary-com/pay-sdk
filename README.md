# `@ordnary/pay-sdk`

Lightweight client-side SDK for **Ordnary Pay**.

## Features

- **Manage Methods**: List, set default, and remove payment methods.
- **Setup Flows**: Support for **Card**, **PayPal**, and **Wero** (via iDEAL).
- **Billing Profiles**: Retrieve and update billing information.
- **Address Search**: Built-in address suggestions for checkout flows.
- **API Spec**: Includes [OpenAPI 3.0](./openapi.yaml) definition.

## Install

```bash
npm install @ordnary/pay-sdk
```

## Usage

```ts
import { createOrdnaryPayClient } from "@ordnary/pay-sdk";

const pay = createOrdnaryPayClient({
  baseUrl: "https://accounts.ordnary.com",
  getHeaders: async () => ({ "x-csrf-token": "..." }),
});

// Get overview
const { methods, billingProfile } = await pay.getPaymentsOverview();

// Start setup flow for a specific method
const { clientSecret } = await pay.createSetupIntent({ 
  paymentMethodType: "paypal" 
});
```

## Safety

- **Browser Safe**: No secret keys required.
- **Boundary**: All sensitive operations are enforced by the Ordnary backend.
- **Privacy**: Does not store or expose full card details.
