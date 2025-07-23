import { BACKEND_URL, DEV_REQUEST_HEADERS } from "../utils";

export const useApi = () => {
  const headers = {
    "Content-Type": "application/json",
    ...DEV_REQUEST_HEADERS,
  };

  const createCart = async (customerId, currency, country) => {
    console.log(`Creating cart for customerId: ${customerId}, currency: ${currency}, country: ${country}`);
    const test1 = process.env.NODE_ENV;
    const test2 = process.env.REACT_APP_BACKEND_URL;
    const test3 = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    console.log({ test1, test2, test3 });
    const res = await fetch(`${BACKEND_URL}/api/cart`, {
      method: "POST",
      headers,
      body: JSON.stringify({ customerId, currency, country }),
    });

    if (!res.ok) {
      throw new Error("Failed to create cart.");
    }
    return await res.json();
  };

  const updateCart = async ({
    cartId,
    productId,
    variantId,
    quantity,
    version,
  }) => {
    const res = await fetch(`${BACKEND_URL}/api/cart/line-item`, {
      method: "POST",
      headers,
      body: JSON.stringify({ cartId, productId, variantId, quantity, version }),
    });
    if (!res.ok) {
      throw new Error("Failed to update cart.");
    }
    return await res.json();
  };

  const addCustomerToCart = async ({ cartId, customerId }) => {
    const res = await fetch(`${BACKEND_URL}/api/cart/customer`, {
      method: "POST",
      headers,
      body: JSON.stringify({ cartId, customerId }),
    });
    if (!res.ok) {
      throw new Error("Failed to add Customer ID to Cart.");
    }
    return await res.json();
  };

  const getConfig = async () => {
    const res = await fetch(`${BACKEND_URL}/api/settings/`, {
      headers,
    });
    if (!res.ok) {
      throw new Error("Failed to fetch configuration.");
    }
    return await res.json();
  };

  const getLanguages = async () => {
    const res = await fetch(`${BACKEND_URL}/api/project/languages`);

    if (!res.ok) {
      throw new Error("Failed to fetch languages.");
    }
    return await res.json();
  };

  const getProducts = async (currency) => {
    const res = await fetch(`${BACKEND_URL}/api/products/${currency}`, {
      headers,
    });
    if (!res.ok) {
      throw new Error("Failed to fetch products.");
    }
    return await res.json();
  };

  const getSubscriptionProducts = async (currency) => {
    const apiUrl = `${BACKEND_URL}/api/subscription/products/${currency}`;
    const res = await fetch(apiUrl, { headers });

    if (!res.ok) {
      throw new Error("Failed to fetch products.");
    }
    return await res.json();
  };

  return {
    createCart,
    updateCart,
    addCustomerToCart,
    getConfig,
    getLanguages,
    getProducts,
    getSubscriptionProducts,
  };
};
