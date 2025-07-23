import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useEnabler } from "../hooks/useEnabler";
import {
  getAddressFromPaymentIntent,
  updateCartShippingAddress,
} from "../utils";

const ExpressCheckout = ({ cart }) => {
  const { enabler, createElement } = useEnabler();
  const currency = useSelector((state) => state.locale.currency);

  const onError = () => {};

  const onComplete = async (payment_intent_id) => {
    const billingAlias = await getAddressFromPaymentIntent(payment_intent_id);
    await updateCartShippingAddress(cart, billingAlias);

    window.location = `${window.location.origin}/success/manual?payment_intent=${payment_intent_id}&cart_id=${cart.id}`;
  };

  useEffect(() => {
    if (!enabler) return;
    createElement({
      type: "expressCheckout",
      selector: "#express",
      onComplete,
      onError,
      currency,
    })
      .then((element) => {
        if (!element) return;
        console.log({ element });
      })
      .catch((error) => {
        console.error("Error creating Express Checkout element:", error);
      });
  }, [enabler]);

  return <div id="express"></div>;
};

export default ExpressCheckout;
