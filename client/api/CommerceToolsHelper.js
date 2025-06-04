import { createClient } from "@commercetools/sdk-client";
import { createAuthMiddlewareForClientCredentialsFlow } from "@commercetools/sdk-middleware-auth";
import { createHttpMiddleware } from "@commercetools/sdk-middleware-http";
import { createRequestBuilder } from "@commercetools/api-request-builder";
import crypto from "crypto";

import fetch from "node-fetch";

let requestBuilder;
let client;

async function createCtClient() {
  console.log("Creating CommerceTools Client...");
  console.log("projectKey: ", process.env.REACT_APP_CT_PROJECT_KEY);
  if (!requestBuilder) {
    const options = {
      projectKey: process.env.REACT_APP_CT_PROJECT_KEY,
    };
    requestBuilder = createRequestBuilder(options);
  }

  return createClient({
    middlewares: [
      createAuthMiddlewareForClientCredentialsFlow({
        host: process.env.REACT_APP_CT_AUTH_URL,
        projectKey: process.env.REACT_APP_CT_PROJECT_KEY,
        credentials: {
          clientId: process.env.REACT_APP_CT_CLIENT_ID,
          clientSecret: process.env.REACT_APP_CT_SECRET,
        },

        // Optional if not globally available
        fetch,
      }),
      createHttpMiddleware({
        host: process.env.REACT_APP_CT_API_URL,
        includeResponseHeaders: true,
        includeOriginalRequest: true,
        maskSensitiveHeaderData: true,
        enableRetry: true,
        retryConfig: {
          maxRetries: 2,
          retryDelay: 300, //milliseconds
          maxDelay: 5000, //milliseconds
        },

        // Optional if not globally available
        fetch,
      }),
    ],
  });
}

async function getProducts() {
  if (!client) {
    client = await createCtClient();
  }
  let uri = requestBuilder.products.build();
  const rsp = await client
    .execute({
      uri: uri,
      method: "GET",
    })
    .catch((e) => {
      console.log(e);
    });
  return rsp.body;
}

async function createCart(customerId) {
  if (!client) {
    client = await createCtClient();
  }
  let uri = requestBuilder.carts.build();
  const rsp = await client.execute({
    uri: uri,
    method: "POST",
    body: {
      currency: "USD",
      country: "US",
      ...(customerId &&  {customerId}),
      shippingAddress: {
        key: "address1",
        firstName: "Jane",
        lastName: "Doe",
        streetName: "First Street",
        streetNumber: "12",
        postalCode: "12345",
        city: "Example City",
        country: "US",
        phone: "+312345678",
        email: "jane.doe@example.com",
      },
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await rsp.body;
}

async function getCart(cartId) {
  if (!client) {
    client = await createCtClient();
  }
  let uri = requestBuilder.carts.byId(cartId).build();
  const rsp = await client.execute({
    uri: uri,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await rsp.body;
}

async function getCustomer(custId) {
  if (!client) {
    client = await createCtClient();
  }
  let uri = requestBuilder.customers.byId(custId).build();
  const rsp = await client.execute({
    uri: uri,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await rsp.body;
}

async function cartAddLineItem(
  cartId,
  productId,
  variantId,
  quantity,
  version
) {
  if (!client) {
    client = await createCtClient();
  }
  let uri = requestBuilder.carts.byId(cartId).build();
  const rsp = await client.execute({
    uri: uri,
    method: "POST",
    body: {
      version: version,
      actions: [
        {
          action: "addLineItem",
          productId: productId,
          variantId: variantId,
          quantity: quantity,
        },
      ],
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await rsp.body;
}

async function cartAddCustomer(cartId, customerId) {
  if (!client) {
    client = await createCtClient();
  }
  const customer = await getCustomer(customerId);
  const cart = await getCart(cartId);
  let uri = requestBuilder.carts.byId(cartId).build();
  let rsp = await client.execute({
    uri: uri,
    method: "POST",
    body: {
      version: cart.version,
      actions: [
        {
          action: "setCustomerId",
          customerId: customerId,
        },
        {
          action: "setShippingAddress",
          address: {
            firstName: customer.addresses[0].firstName,
            lastName: customer.addresses[0].lastName,
            country: customer.addresses[0].country,
          },
        },
      ],
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await rsp.body;
}

async function getCustomerByEmail(email) {
  if (!client) {
    client = await createCtClient();
  }
  let uri = requestBuilder.customers.where(`email = "${email}"`).build();
  const rsp = await client.execute({
    uri: uri,
    method: "GET",
  });
  return await rsp.body;
}

async function createCustomer(params, stripeCustId) {
  if (!client) {
    client = await createCtClient();
  }
  let uri = requestBuilder.customers.build();
  let customerBody = {
    email: params.email,
    password: "jAE#HW7Y-6#H9uq",
    firstName: params.name.split(" ")[0],
    lastName: params.name.split(" ")[1],
    addresses: [
      {
        streetName: params.address.line1,
        city: params.address.city,
        country: params.address.country,
      },
    ],
    externalId: stripeCustId,
    anonymousCart: {
      id: params.cartId,
    },
  };
  const rsp = await client.execute({
    uri: uri,
    method: "POST",
    body: customerBody,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await rsp.body.customer;
}

async function createPayment(paymentIntent, currency, centAmount) {
  if (!client) {
    client = await createCtClient();
  }
  let uri = requestBuilder.payments.build();
  let paymentBody = {
    key: paymentIntent.id,
    paymentMethodInfo: {
      paymentInterface: "Stripe",
      method: paymentIntent.payment_method_types[0],
    },
    amountPlanned: {
      currencyCode: currency.toUpperCase(),
      centAmount: centAmount,
    },
  };
  const rsp = await client.execute({
    uri: uri,
    method: "POST",
    body: paymentBody,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await rsp.body;
}

async function createOrder(cart) {
  if (!client) {
    client = await createCtClient();
  }
  let uri = requestBuilder.orders.build();
  let orderBody = {
    cart: {
      id: cart.id,
      typeId: "cart",
    },
    version: cart.version,
    orderState: "Open",
    paymentState: "Pending",
    shipmentState: "Pending",
    purchaseOrderNumber: `order-${crypto.randomUUID().split("-")[0]}`,
  };

  const rsp = await client.execute({
    uri: uri,
    method: "POST",
    body: orderBody,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await rsp.body;
}

async function getOrder(orderId) {
  if (!client) {
    client = await createCtClient();
  }
  let uri = requestBuilder.orders.byId(orderId).build();
  const rsp = await client.execute({
    uri: uri,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await rsp.body;
}

async function getPayment(paymentIntent) {
  if (!client) {
    client = await createCtClient();
  }
  let uri = requestBuilder.payments.byKey(paymentIntent.id).build();
  const rsp = await client.execute({
    uri: uri,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await rsp.body;
}

async function addPaymentToOrder(orderId, payment) {
  if (!client) {
    client = await createCtClient();
  }
  let order = await getOrder(orderId);
  let uri = requestBuilder.orders.byId(orderId).build();
  const rsp = await client.execute({
    uri: uri,
    method: "POST",
    body: {
      version: order.version,
      actions: [
        {
          action: "addPayment",
          payment: {
            typeId: "payment",
            id: payment.id,
          },
        },
      ],
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await rsp.body;
}

async function updatePaymentState(paymentType, paymentIntent) {
  if (!client) {
    client = await createCtClient();
  }
  const payment = await getPayment(paymentIntent);

  let uri = requestBuilder.payments.byKey(paymentIntent.id).build();

  let paymentState = "Pending";

  if (paymentType === "Charge" || paymentType === "Refund") {
    paymentState = "Success";
  }

  try {
    const rsp = await client.execute({
      uri: uri,
      method: "POST",
      body: {
        version: payment.version,
        actions: [
          {
            action: "addTransaction",
            transaction: {
              type: paymentType, //Authorization, CancelAuthorization, Charge, Refund, Chargeback
              amount: {
                currencyCode: paymentIntent.currency.toUpperCase(),
                centAmount: paymentIntent.amount,
              },
              state: paymentState, //Initial, Pending, Success, Failure
            },
          },
        ],
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return await rsp.body;
  } catch (e) {
    console.log("====================================");
    console.log("commercetools error msg: ", e);
    console.log("====================================");
  }
}

async function updateOrder(orderId, paymentState) {
  if (!client) {
    client = await createCtClient();
  }
  let order = await getOrder(orderId);
  let uri = requestBuilder.orders.byId(orderId).build();
  const rsp = await client.execute({
    uri: uri,
    method: "POST",
    body: {
      version: order.version,
      actions: [
        {
          action: "changePaymentState",
          paymentState: paymentState,
        },
      ],
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await rsp.body;
}

async function cartAddShippingAddres(cartId, address, version) {
  if (!client) {
    client = await createCtClient();
  }

  let uri = requestBuilder.carts.byId(cartId).build();
  const rsp = await client.execute({
    uri: uri,
    method: "POST",
    body: {
      version: version,
      actions: [
        {
          action: "setShippingAddress",
          address: {
            key: address.addressName,
            country: address.addressCountry,
            streetName: address.addressLine1,
            postalCode: address.addressPostalCode,
            state: address.addressState,
            city: address.addressCity,
          },
        },
      ],
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await rsp.body;
}

const commerceToolsHelper = {
  getProducts,
  createCart,
  getPayment,
  cartAddLineItem,
  getCustomerByEmail,
  createCustomer,
  getCart,
  cartAddCustomer,
  getCustomer,
  createPayment,
  createOrder,
  addPaymentToOrder,
  updateOrder,
  updatePaymentState,
  cartAddShippingAddres,
};

export default commerceToolsHelper;
