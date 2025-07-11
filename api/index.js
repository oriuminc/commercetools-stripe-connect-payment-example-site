import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import cors from "cors";
import dotenv from "dotenv";

import commerceTools from "./CommerceToolsHelper.js";
import Stripe from "stripe";

const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../../build"); // Vercel serverless function path
  app.use("/confirm", express.static(buildPath));
}

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"], // puedes agregar más métodos si es necesario
  allowedHeaders: ["Content-Type", "ngrok-skip-browser-warning"], // puedes agregar más encabezados si es necesario
  optionsSuccessStatus: 200, // algunos navegadores (IE11, algunos SmartTVs) requieren esto
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// app.use(cors());

dotenv.config();

const STRIPE_KEY = process.env.STRIPE_KEY;
const STRIPE_ADMIN = process.env.STRIPE_ADMIN;

const stripe = new Stripe(STRIPE_KEY);

/* ------ BUSINESS MODEL ------ */
app.get("/api/settings", async (req, res) => {
  const account = await stripe.accounts.retrieve(STRIPE_ADMIN);
  let icon = false;
  if (account.settings.branding.logo) {
    const iconFile = await stripe.files.retrieve(
      account.settings.branding.icon
    );
    icon = iconFile.links.data[0].url || false;
  }

  res.send({
    shop_name: account.settings.dashboard.display_name,
    icon: icon,
    primary_color: account.settings.branding.primary_color,
  });
});

app.get("/api/project/languages", async (_, res) => {
  console.log("Fetching available languages");
  const languages = await commerceTools.getLanguages();
  res.send(languages);
});

app.get("/api/products/:currency", async (req, res) => {
  const currency = req.params.currency;
  console.log(`Fetching products for currency: ${currency}`);
  const ctProducts = await commerceTools.getProducts();
  res.send(ctProducts.results);
});

app.get("/api/subscription/products/:currency", async (req, res) => {
  const currency = req.params.currency;
  console.log(`Fetching subscription products for currency: ${currency}`);
  const ctProducts = await commerceTools.getSubscriptionProducts();
  res.send(ctProducts.results);
});

/* ------ GET CUSTOMER BY EMAIL ------ */
app.get("/customer/:email?", async (req, res) => {
  const customers = await commerceTools.getCustomerByEmail(req.params.email);
  if (req.params.email === undefined || customers.total === 0)
    res.send({
      id: "",
      name: "",
      address: "",
      city: "",
      country: "",
    });
  else {
    res.send({
      id: customers.results[0].id,
      name: `${customers.results[0].firstName} ${customers.results[0].lastName}`,
      addressId: customers.results[0].addresses[0].id,
      address: `${customers.results[0].addresses[0].streetName}`,
      city: customers.results[0].addresses[0].city,
      country: customers.results[0].addresses[0].country,
    });
  }
});

/* ------ GET CART------ */
app.get("/api/cart/:cartId?", async (req, res) => {
  res.send(await commerceTools.getCart(req.params.cartId));
});

/* ------ CREATE CART ------ */
app.post("/api/cart", async (req, res) => {
  const customerId = req.body.customerId || null;
  const currency = req.body.currency || "USD";
  const country = req.body.country || "US";
  console.log(`Creating cart for customerId: ${customerId}`);
  res.send(await commerceTools.createCart(customerId, currency, country));
});

/* ------ ADD CART LINE ITEM ------ */
app.post("/api/cart/line-item", async (req, res) => {
  const cartId = req.body.cartId;
  const productId = req.body.productId;
  const variantId = req.body.variantId;
  const quantity = req.body.quantity;
  const version = req.body.version;
  let result = await commerceTools
    .cartAddLineItem(cartId, productId, variantId, quantity, version)
    .catch((e) => console.log(`Error : ${e}`));
  res.send(result);
});

/* ------ ADD CUSTOMER TO CART------ */
app.post("/api/cart/customer", async (req, res) => {
  const cartId = req.body.cartId;
  const customerId = req.body.customerId;
  res.send(await commerceTools.cartAddCustomer(cartId, customerId));
});

// Retrieving a session or a PI to display details on redirect from hosted checkout or from UPE
app.get("/session/:id", async (req, res) => {
  const id = req.params.id;
  let pi;

  if (id.indexOf("cs_") > -1) {
    const session = await stripe.checkout.sessions.retrieve(id);
    pi = await stripe.paymentIntents.retrieve(session.payment_intent);
  } else {
    pi = await stripe.paymentIntents.retrieve(id);
  }

  res.send({
    receipt: pi.id,
    //email: pi.charges.data[0].billing_details.email
  });
});

/* ------ ELEMENTS AND UPE ------ */
app.post("/create-payment-intent", async (req, res) => {
  const cart = req.body.cart;
  const ctCustomerId = req.body.customer;
  const ctCustomer = await commerceTools.getCustomer(ctCustomerId);
  const currency = req.body.currency;
  const order = await commerceTools.createOrder(cart, "Open");

  let total = cart.totalPrice.centAmount;
  let summary = "";
  cart.lineItems.forEach((item) => {
    summary += item.id + "  [" + item.name["de-DE"] + "] ";
  });

  const payload = {
    amount: total,
    currency,
    metadata: {
      summary: summary,
      commerceToolsCartId: cart.id,
      commerceToolsOrderId: order.id,
    },
    capture_method: "automatic",
    customer: ctCustomer.externalId,
  };

  if (currency === "USD") {
    payload.payment_method_types = ["card", "afterpay_clearpay"];
  }
  if (currency === "EUR") {
    payload.payment_method_types = ["card", "sofort", "giropay"];
  }
  if (currency === "GBP") {
    payload.payment_method_types = ["card", "bacs_debit"];
  }

  const paymentIntent = await stripe.paymentIntents.create(payload);

  const payment = await commerceTools.createPayment(
    paymentIntent,
    currency,
    total
  );
  commerceTools.updatePaymentState("Authorization", paymentIntent);

  await commerceTools.addPaymentToOrder(order.id, payment);

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

/* ------ ADD CART ADDRESS SHIPING ------ */
app.post("/api/cart/address", async (req, res) => {
  const cartId = req.body.cartId;
  const { version } = await commerceTools.getCart(cartId);
  const address = req.body.address;
  let result = await commerceTools
    .cartAddShippingAddres(cartId, address, version)
    .catch((e) => console.log(`Error : ${e}`));
  res.send(result);
});

app.post("/create-order", async (req, res) => {
  const id = req.body.id;
  const { version } = await commerceTools.getCart(id);

  let result = await commerceTools
    .createOrder({ id, version })
    .catch((e) => console.log(`Error : ${e}`));
  res.send(result);
});

app.post("/capture-payment", async (req, res) => {
  const payment_intent = req.body.payment_intent;

  const paymentResult = await stripe.paymentIntents.capture(payment_intent);

  res.send(paymentResult);
});

app.post("/cancel-payment", async (req, res) => {
  const payment_intent = req.body.payment_intent;

  const cancelResult = await stripe.paymentIntents.cancel(payment_intent);

  res.send(cancelResult);
});

app.post("/request-refund", async (req, res) => {
  const chargeId = req.body.chargeId;

  const refundResult = await stripe.refunds.create({
    charge: chargeId,
  });

  res.send(refundResult);
});

app.get("/payment-intent/:payment_intent", async (req, res) => {
  const payment_intent = req.params.payment_intent;

  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
  res.send(paymentIntent);
});

app.get("/charge/:charge_id", async (req, res) => {
  const charge_id = req.params.charge_id;

  const charge = await stripe.charges.retrieve(charge_id);

  res.send(charge);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", environment: "vercel" });
});

if (process.env.NODE_ENV === "dev") 
  app.listen(5000);

export default app;
