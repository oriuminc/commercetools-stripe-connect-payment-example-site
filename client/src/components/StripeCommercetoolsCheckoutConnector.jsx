import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { checkoutFlow } from "@commercetools/checkout-browser-sdk";
import { useCheckout } from "../hooks/useEnabler";
import { DEV_REQUEST_HEADERS, getCartById } from "../utils";

const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PRODUCTION_URL || ""
    : "http://localhost:5000";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const StripeCommercetoolsCheckoutConnector = ({ setCart }) => {
  const { sessionId } = useCheckout();
  const query = useQuery();
  const paymentReferenceRef = useRef("");
  const currentLocale = useSelector((state) => state.locale.locale);

  const getPaymentInformation = async (payment_intent_id) => {
    let response = await fetch(
      `${BACKEND_URL}/payment-intent/${payment_intent_id}`,
      {
        headers: {
          ...DEV_REQUEST_HEADERS,
        },
      }
    );
    const payment_intent = await response.json();
    paymentReferenceRef.current = payment_intent.metadata.ct_payment_id;
    const cart = await getCartById(payment_intent.metadata.cart_id);
    if (cart) setCart(cart);
  };

  const getCart = async (cartId) => {
    const cart = await getCartById(cartId);
    console.log(JSON.stringify(cartId));
    console.log(JSON.stringify(cart));
    if (cart) setCart(cart);
  };

  useEffect(() => {
    const payment_intent_id = query.get("payment_intent");
    const paymentReference = query.get("paymentReference");
    const cartId = query.get("cartId");
    if (paymentReference && cartId) {
      paymentReferenceRef.current = paymentReference;
      getCart(cartId);
    } else if (payment_intent_id) {
      getPaymentInformation(payment_intent_id);
    }
  }, []);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    //paymentFlow({
    checkoutFlow({
      projectKey: "stripe-subscription",
      region: "us-central1.gcp",
      locale: currentLocale,
      currencyLocale: currentLocale,
      paymentReference: paymentReferenceRef.current,
      sessionId: `${sessionId}`,
      logInfo: true,
      logWarn: true,
      logError: true,
      onInfo: (message) => {
        console.log(`onInfo ${JSON.stringify(message, null, 2)}`);
        if (message.code === "checkout_completed") {
          window.location.href =
            "/thank-you?orderId=" + message.payload.order.id;
        }
      },
      onWarn: (message) => {
        console.log(`onWarn ${JSON.stringify(message, null, 2)}`);
      },
      onError: (message) => {
        console.log(`onError ${JSON.stringify(message, null, 2)}`);
      },
      forms: {
        default: {
          address: {
            disableDefaultValidations: true,
          },
        },
      },
    });
  }, [sessionId]);

  return (
    <div className="col-12">
      <div data-ctc="" className="checkout-Container" />
      {!sessionId && (
        <p>
          Your cart is empty, add products{" "}
          <a href="/" className="text-[#635bff] underline">
            here
          </a>
        </p>
      )}
    </div>
  );
};

export default StripeCommercetoolsCheckoutConnector;
