import React, { useEffect } from "react";
import { useEnabler } from "../hooks/useEnabler";
import {
  getAddressFromPaymentIntent,
  updateCartShippingAddress,
} from "../utils";

const ExpressCheckout = ({ cart, language }) => {
  const { enabler, createElement } = useEnabler({language});

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
    }).then((element) => {
      if (!element) return;
      console.log({element})
    });
  }, [enabler]);

  return <div id="express"> </div>;
};

export default ExpressCheckout;
