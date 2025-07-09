import React from "react";
import { EnablerContextProvider } from "../context/enablerContext";
import StripeCommercetoolsConnectorCheckout from "./StripeCommercetoolsCheckoutConnector";
import { SUBSCRIPTION_PRODUCT_TYPE_NAME } from "../utils";
import { Link } from "react-router-dom/cjs/react-router-dom";

export default function CheckoutCtConnector({ cart, setCart }) {
  const hasSubscriptionItem = cart?.lineItems.some(
    ({ productType }) => productType.obj.name === SUBSCRIPTION_PRODUCT_TYPE_NAME
  );

  return hasSubscriptionItem ? (
    <p className="my-8">
      Subscription items are not supported by the Checkout connector, please try
      with a different product or use the Composable Connector.{" "}
      <Link to="/" style={{ textDecoration: "underline" }}>
        Go to Home Page.
      </Link>
    </p>
  ) : (
    <>
      <EnablerContextProvider
        cartId={cart?.id}
        connector={"commercetoolsCheckoutConnectorConfig"}
      >
        <div className="flex flex-row justify-between gap-5">
          <StripeCommercetoolsConnectorCheckout setCart={setCart} />
        </div>
      </EnablerContextProvider>
    </>
  );
}
