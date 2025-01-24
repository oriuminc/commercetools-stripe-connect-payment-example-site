import React, { useEffect, useRef } from "react";
import { EnablerContextProvider } from "../context/enablerContext";
import StripeCommercetoolsCheckoutConnector from "./StripeCommercetoolsCheckoutConnector";


export default function CheckoutCtConnector(props) {
  const stripe = useRef()

  useEffect(() => {
    if(!stripe) return;

  },[stripe])

  return (
    <>
    {props.cart && (
      <EnablerContextProvider cartId={props.cart?.id} connector={'ctConnector'}>
        <div className="flex flex-row justify-between gap-5">
          <StripeCommercetoolsCheckoutConnector cart={props.cart} />
        </div>
      </EnablerContextProvider>
    )}
    {
      !props.cart &&
      <p>
        Your cart is empty, add products <a href="/" className="text-[#635bff] underline">here</a>
      </p>
    }
    </>
  );
}
