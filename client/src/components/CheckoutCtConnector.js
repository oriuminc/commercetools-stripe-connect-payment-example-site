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
      <EnablerContextProvider cartId={props.cart?.id} connector={'ctConnector'}>
        <div className="flex flex-row justify-between gap-5">
          <StripeCommercetoolsCheckoutConnector cart={props.cart} setCart={props.setCart} />
        </div>
      </EnablerContextProvider>

    </>
  );
}
