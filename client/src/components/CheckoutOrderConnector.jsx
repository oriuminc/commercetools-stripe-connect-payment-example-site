import React from "react";
import Cart from "./Cart";
import { EnablerContextProvider } from "../context/enablerContext";
import StripeComposableConnectorCheckout from "./StripeComposableConnectorCheckout";
import { SUBSCRIPTION_PRODUCT_TYPE_NAME } from "../utils";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FormattedMessage } from "react-intl";

export default function CheckoutOrderConnector({ cart, currency }) {
  const hasInvalidSubscriptionItem =
    cart?.totalLineItemQuantity > 1 &&
    cart?.lineItems?.some(
      ({ productType }) =>
        productType.obj.name === SUBSCRIPTION_PRODUCT_TYPE_NAME
    );

  if (hasInvalidSubscriptionItem) {
    return (
      <p className="my-8">
        When adding a subscription item to the cart, it must be the only item in
        the cart. Please remove other items and try again.{" "}
        <Link to="/" style={{ textDecoration: "underline" }}>
          Go to Home Page.
        </Link>
      </p>
    );
  }

  return cart && cart.lineItems.length > 0 ? (
    <EnablerContextProvider
      cartId={cart?.id}
      connector={"composableConnectorConfig"}
    >
      <div className="flex flex-row justify-between gap-5">
        <StripeComposableConnectorCheckout cart={cart} />
        <div className="bg-black w-4/12">
          {cart && cart.lineItems && <Cart cart={cart} currency={currency} />}
        </div>
      </div>
    </EnablerContextProvider>
  ) : (
    <p>
      <FormattedMessage
        id="label.emptyCartDescription"
        defaultMessage={"Your cart is empty, add products"}
      />
      &nbsp;
      <a href="/" className="text-[#635bff] underline">
        <FormattedMessage id="button.clickHere" defaultMessage={"Click here"} />
      </a>
    </p>
  );
}
