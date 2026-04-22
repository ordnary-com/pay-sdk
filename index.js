function normalizeBaseUrl(url) {
  return url.replace(/\/$/, "");
}

function isBillingProfileComplete(profile) {
  if (!profile) return false;

  return Boolean(
    profile.fullName &&
      profile.country &&
      profile.line1 &&
      profile.city &&
      profile.postalCode
  );
}

function withFlatBillingProfile(body, billingProfile) {
  if (!isBillingProfileComplete(billingProfile)) {
    return body;
  }

  return {
    ...body,
    fullName: billingProfile.fullName,
    country: billingProfile.country,
    line1: billingProfile.line1,
    line2: billingProfile.line2,
    city: billingProfile.city,
    state: billingProfile.state,
    postalCode: billingProfile.postalCode,
  };
}

export function createOrdnaryPayClient(config) {
  if (!config?.baseUrl) {
    throw new Error("baseUrl is required");
  }

  const baseUrl = normalizeBaseUrl(config.baseUrl);
  const fetchImpl = config.fetch || globalThis.fetch;

  if (typeof fetchImpl !== "function") {
    throw new Error("A fetch implementation is required");
  }

  async function buildHeaders(extraHeaders = {}) {
    const configuredHeaders = config.getHeaders ? await config.getHeaders() : {};
    return {
      ...configuredHeaders,
      ...extraHeaders,
    };
  }

  async function request(path, init = {}) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      credentials: "include",
      ...init,
      headers: await buildHeaders(init.headers || {}),
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        payload && typeof payload === "object" && "error" in payload
          ? payload.error
          : typeof payload === "string" && payload
            ? payload
            : "ordnary_pay_request_failed";
      throw new Error(String(message));
    }

    return payload;
  }

  return {
    baseUrl,
    getPaymentsOverview() {
      return request("/api/account/payments/overview");
    },
    createSetupIntent(input = {}) {
      const body = withFlatBillingProfile({}, input.billingProfile);

      return request("/api/account/payments/setup-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    },
    syncPaymentMethod(input) {
      if (!input?.setupIntentId) {
        throw new Error("setupIntentId is required");
      }

      const body = withFlatBillingProfile({
        setupIntentId: input.setupIntentId,
        makeDefault: input.makeDefault ?? true,
      }, input.billingProfile);

      return request("/api/account/payments/methods/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    },
    setDefaultPaymentMethod(paymentMethodId) {
      if (!paymentMethodId) {
        throw new Error("paymentMethodId is required");
      }

      return request("/api/account/payments/methods/default", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentMethodId }),
      });
    },
    removePaymentMethod(paymentMethodId) {
      if (!paymentMethodId) {
        throw new Error("paymentMethodId is required");
      }

      return request(`/api/account/payments/methods/${encodeURIComponent(paymentMethodId)}`, {
        method: "DELETE",
      });
    },
  };
}
