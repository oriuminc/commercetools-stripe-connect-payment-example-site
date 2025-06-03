import React from "react";
import Cart from "./Cart";
import { EnablerContextProvider } from "../context/enablerContext";
import StripeComposableConnectorCheckout from "./StripeComposableConnectorCheckout";

export default function CheckoutOrderConnector(props) {


  return (
    <>
      {props.cart && (
        <EnablerContextProvider
          cartId={props.cart?.id}
          connector={"composableConnectorProcessor"}
        >
          <div className="flex flex-row justify-between gap-5">
            <StripeComposableConnectorCheckout cart={props.cart} />
            <div className="bg-black w-4/12">
              {props.cart && props.cart.lineItems && (
                <Cart cart={props.cart} currency={props.currency} />
              )}
            </div>
          </div>
        </EnablerContextProvider>
      )}
      {!props.cart && (
        <p>
          Your cart is empty, add products{" "}
          <a href="/" className="text-[#635bff] underline">
            here
          </a>
        </p>
      )}
    </>
  );
}
