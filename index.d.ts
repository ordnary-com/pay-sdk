export type BillingProfileInput = {
  fullName: string;
  country: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
};

export type PaymentMethodType = "card" | "paypal" | "ideal";

export type PaymentMethodSummary = {
  id: string;
  type: string;
  isDefault: boolean;
  cardholderName: string | null;
  brand: string | null;
  last4: string | null;
  expMonth: number | null;
  expYear: number | null;
  funding: string | null;
  country: string | null;
  email: string | null;
  bankName: string | null;
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

export type CreateSetupIntentInput = {
  billingProfile?: BillingProfileInput;
  paymentMethodType?: PaymentMethodType;
};

export type OrdnaryPayClient = {
  baseUrl: string;
  getPaymentsOverview: () => Promise<PaymentsOverview>;
  createSetupIntent: (input?: CreateSetupIntentInput) => Promise<CreateSetupIntentResult>;
  syncPaymentMethod: (input: SyncPaymentMethodInput) => Promise<PaymentsOverview>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<PaymentsOverview>;
  removePaymentMethod: (paymentMethodId: string) => Promise<PaymentsOverview>;
};

export function createOrdnaryPayClient(config: OrdnaryPayClientConfig): OrdnaryPayClient;
