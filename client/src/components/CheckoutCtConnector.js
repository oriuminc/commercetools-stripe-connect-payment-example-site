import React from "react";
import { EnablerContextProvider } from "../context/enablerContext";
import StripeCommercetoolsConnectorCheckout from "./StripeCommercetoolsCheckoutConnector";

export default function CheckoutCtConnector(props) {

  return (
    <>
      <EnablerContextProvider
        cartId={props.cart?.id}
        connector={"commercetoolsCheckoutConnectorConfig"}
      >
        <div className="flex flex-row justify-between gap-5">
          <StripeCommercetoolsConnectorCheckout
            setCart={props.setCart}
          />
        </div>
      </EnablerContextProvider>
    </>
  );
}
