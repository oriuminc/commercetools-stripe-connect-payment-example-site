import { BACKEND_URL, projectKey, SUBSCRIPTIONS_API_URL } from "./constants";

export const loadEnabler = async (enablerUrl) => {
  try {
    if (!enablerUrl || typeof enablerUrl !== "string") {
      console.error("Invalid enabler URL:", enablerUrl);
      return null;
    }

    console.log("Attempting to load enabler from:", enablerUrl);
    const module =
      enablerUrl === "composable"
        ? await import(process.env.REACT_APP_COMPOSABLE_CONNECTOR_ENABLER_URL)
        : await import(
            process.env.REACT_APP_COMMERCETOOLS_CHECKOUT_CONNECTOR_ENABLER_URL
          );
    console.log(JSON.stringify(module, null, 2));
    return module;
  } catch (error) {
    console.error("Error while loading Enabler module", error);
  }
};

export const fetchAdminToken = async () => {
  const headers = new Headers();

  headers.append(
    "Authorization",
    `Basic ${btoa(
      `${process.env.REACT_APP_CT_CLIENT_ID}:${process.env.REACT_APP_CT_SECRET}`
    )}`
  );
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const response = await fetch(
    `${process.env.REACT_APP_CT_AUTH_URL}/oauth/token`,
    {
      body: urlencoded,
      headers: headers,
      method: "POST",
      redirect: "follow",
    }
  );

  const token = await response.json();

  if (response.status !== 200) {
    console.log({
      title: "Token fetch failed",
      message: `Error ${response.status} while fetching token`,
    });
    return;
  } else {
    console.log({
      title: "Token fetched",
      message: `Token fetched: ${token.access_token}`,
    });
  }
  console.log("Token fetched:", token);
  return token;
};

export const getCTSessionId = async (cartId) => {
  const accessToken = await fetchAdminToken();

  const sessionMetadata = {
    applicationKey: "checkout-test-subscription",
  };

  const url = `${process.env.REACT_APP_SESSION_URL}/${projectKey}/sessions`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken.access_token}`,
    },
    body: JSON.stringify({
      cart: {
        cartRef: {
          id: cartId,
        },
      },
      metadata: sessionMetadata,
    }),
  });
  const data = await res.json();

  if (!res.ok) {
    console.error("Not able to create session:", url, data);
    throw new Error("Not able to create session");
  }

  console.log("Session created:", data);
  return data.id;
};

export const updateCartShippingAddress = async (cart, address) => {
  const bodyConst = JSON.stringify({
    cartId: cart.id,
    address: {
      addressName: address.name,
      addressLine1: address.address.line1,
      addressCity: address.address.city,
      addressCountry: address.address.country,
      addressPostalCode: address.address.postal_code,
      addressState: address.address.state,
    },
  });

  return fetch(`${BACKEND_URL}/api/cart/address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...DEV_REQUEST_HEADERS,
    },
    body: bodyConst,
  })
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
};

export const getAddressFromPaymentIntent = async (payment_intent_id) => {
  let response = await fetch(
    `${BACKEND_URL}/payment-intent/${payment_intent_id}`,
    {
      headers: {
        ...DEV_REQUEST_HEADERS,
      },
    }
  );
  const payment_intent = await response.json();
  const { latest_charge } = payment_intent;
  let responseCharge = await fetch(`${BACKEND_URL}/charge/${latest_charge}`, {
    headers: {
      ...DEV_REQUEST_HEADERS,
    },
  });
  const charge = await responseCharge.json();
  const { billing_details, shipping } = charge;
  let billingAlias = shipping;

  if (!shipping && billing_details) {
    billingAlias = billing_details;
  }

  return billingAlias;
};

export const getCartById = async (cartId) => {
  const cart = await fetch(`${BACKEND_URL}/api/cart/${cartId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...DEV_REQUEST_HEADERS,
    },
  });
  return await cart.json();
};

export const getCustomerStripeId = async (customerId) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/customers/${customerId}/stripe-id`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch customer Stripe ID");
    }

    const data = await response.json();
    return data.stripeId;
  } catch (error) {
    return null;
  }
};

export const getCustomerSubscription = async (customerId, token) => {
  try {
    if (customerId === undefined || customerId === null || customerId === "")
      return [];

    const response = await fetch(`${SUBSCRIPTIONS_API_URL}/${customerId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch customer subscription");
    }

    return await response.json();
  } catch {
    return [];
  }
};

export const cancelCustomerSubscription = async (
  customerId,
  subscriptionId,
  token
) => {
  try {
    const response = await fetch(
      `${SUBSCRIPTIONS_API_URL}/${customerId}/${subscriptionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to cancel subscription");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const patchCustomerSubscription = async (
  customerId,
  subscriptionId,
  updateData,
  token
) => {
  try {
    const response = await fetch(`${SUBSCRIPTIONS_API_URL}/advanced/${customerId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: subscriptionId,
        params: {
          items: [
            {
              id: updateData.subscriptionItemId,
              quantity: updateData.quantity,
            },
          ],
          proration_behavior: "none", // Can be "create_prorations", "always_invoice" or "none"
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update subscription");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateCustomerSubscription = async (
  customerId,
  subscriptionId,
  newProductId,
  newVariantPosition,
  newPriceId,
  token
) => {
  try {
    const response = await fetch(`${SUBSCRIPTIONS_API_URL}/${customerId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        subscriptionId: subscriptionId,
        newSubscriptionVariantId: newProductId,
        newSubscriptionVariantPosition: newVariantPosition,
        newSubscriptionPriceId: newPriceId
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update subscription");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

const MODE = process.env.NODE_ENV;
console.log({ MODE });
export const DEV_REQUEST_HEADERS =
  MODE === "dev"
    ? {
        "ngrok-skip-browser-warning": "6024",
      }
    : {};

console.log({ DEV_REQUEST_HEADERS });
