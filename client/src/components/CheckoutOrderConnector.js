import React, { useEffect, useRef } from "react";
import Cart from "./Cart";
import { EnablerContextProvider } from "../context/enablerContext";
import StripeCheckoutOrderConnector from "./StripeCheckoutOrderConnector";


export default function CheckoutOrderConnector(props) {
  const stripe = useRef()

  useEffect(() => {
    if(!stripe) return;

  },[stripe])

  return (
    <>
    {props.cart && (
      <EnablerContextProvider cartId={props.cart?.id} orderConnector={true}>
        <div className="flex flex-row justify-between gap-5">
          <StripeCheckoutOrderConnector cart={props.cart} />
          <div className="bg-black w-4/12">
            {props.cart && props.cart.lineItems &&
              <Cart cart={props.cart} currency={props.currency} />
            }
          </div>
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
