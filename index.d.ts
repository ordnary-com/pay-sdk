export type BillingProfileInput = {
  fullName: string;
  country: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
};

export type PaymentMethodSummary = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number | null;
  expYear: number | null;
  funding: string | null;
  country: string | null;
  cardholderName: string | null;
  isDefault: boolean;
};

export type PaymentsOverview = {
  methods: PaymentMethodSummary[];
  defaultPaymentMethodId: string | null;
  billingProfile: BillingProfileInput | null;
  publishableKey: string;
};

export type CreateSetupIntentResult = {
  clientSecret: string;
  publishableKey: string;
};

export type OrdnaryPayClientConfig = {
  baseUrl: string;
  fetch?: typeof fetch;
  getHeaders?: () => HeadersInit | Promise<HeadersInit>;
};

export type SyncPaymentMethodInput = {
  setupIntentId: string;
  makeDefault?: boolean;
  billingProfile?: BillingProfileInput;
};

export type OrdnaryPayClient = {
  baseUrl: string;
  getPaymentsOverview: () => Promise<PaymentsOverview>;
  createSetupIntent: (input?: { billingProfile?: BillingProfileInput }) => Promise<CreateSetupIntentResult>;
  syncPaymentMethod: (input: SyncPaymentMethodInput) => Promise<PaymentsOverview>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<PaymentsOverview>;
  removePaymentMethod: (paymentMethodId: string) => Promise<PaymentsOverview>;
};

export function createOrdnaryPayClient(config: OrdnaryPayClientConfig): OrdnaryPayClient;
