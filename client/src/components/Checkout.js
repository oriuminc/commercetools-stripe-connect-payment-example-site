import React, { useEffect, useRef, useState } from "react";
import Cart from "./Cart";
import CheckoutHosted from "./CheckoutHosted";
import CheckoutUPE from "./CheckoutUPE";
import Customer from "./Customer";
import { getCTSessionId, loadEnabler } from "../utils";
import { EnablerContext, EnablerContextProvider } from "../context/enablerContext";
import { AddressElement, Elements, LinkAuthenticationElement } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckout from "./StripeCheckout";

const procesorUrl = process.env.REACT_APP_PROCESOR_URL;
const stripepk = process.env.REACT_APP_PK;

export default function Checkout(props) {
  // If you want to only show one way to checkout, turn one of the following 3 variable to default to true
  const [showHosted, setShowHosted] = useState(false);
  const [showUPE, setShowUPE] = useState(false);
  const [custId, setCustId] = useState("");
  const [custInfo, setCustInfo] = useState({ name: "bob", city: "chicago" });

  const enablerRef = useRef()
  const stripe = useRef()
  const stripeElements = useRef()

  const styles = {
    header: {
      marginBottom: 15,
      marginTop: 25,
    },
    selector: {
      marginBottom: 20,
    },
  };

  const handleChange = (e) => {
    e.preventDefault();
    setShowHosted(e.target.value === "hosted");
    setShowUPE(e.target.value === "upe");
  };

    
  useEffect(() => {
    if(!stripe) return;
    
  },[stripe])

  
  return (
    <>
    {props.cart && (
      <EnablerContextProvider cartId={props.cart?.id}>
        <div className="flex flex-row justify-between gap-5">
          <StripeCheckout />
          <div className="bg-black w-4/12">
            {props.cart && props.cart.lineItems &&
              <Cart cart={props.cart} currency={props.currency} />
            }
          </div>
        </div>
      </EnablerContextProvider>
    )}
    
      {false && (
        <div className="row">
          <div className="col-6">
            <Cart cart={props.cart} currency={props.currency} />
          </div>
          <div className="col-6">
            <Customer
              setCustId={setCustId}
              setCustInfo={setCustInfo}
              setCart={props.setCart}
              cart={props.cart}
              custId={custId}
              />
            {custId && (
              <>
                <h4 style={styles.header}>Checkout</h4>
                {/* If you want to only show one way to checkout, remove or comment out this <select> element  */}
                <select
                  className="form-control"
                  style={styles.selector}
                  disabled={custId === ""}
                  defaultValue=""
                  onChange={handleChange}
                  >
                  <option value="">How would you like to check out?</option>
                  <option value="hosted">Via Stripe-hosted page</option>
                  <option value="upe">Via custom form (Next Generation)</option>
                </select>
              </>
            )}
            {custId && showHosted && (
              <CheckoutHosted
              cart={props.cart}
              custId={custId}
              brandColor={props.brandColor}
              currency={props.currency}
              />
              )}
            <form id="payment">

            </form>
            {custId && showUPE && (
              <>
                <CheckoutUPE
                  cart={props.cart}
                  custId={custId}
                  custInfo={custInfo}
                  brandColor={props.brandColor}
                  currency={props.currency}
                  />
              </>
            )}
          </div>
        </div>
      )}
      {!props.cart && (
        <div className="row">
          <div className="col">Your cart is empty</div>
        </div>
      )}
    </>
  );
}
