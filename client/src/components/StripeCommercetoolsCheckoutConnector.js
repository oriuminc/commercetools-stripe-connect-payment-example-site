import React, { useEffect, useRef } from "react";
import { useCheckout } from "../hooks/useEnabler";
import { checkoutFlow } from "@commercetools/checkout-browser-sdk";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { DEV_REQUEST_HEADERS } from "../utils";

const BACKEND_URL = process.env.REACT_APP_BASE_URL;

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const StripeCommercetoolsCheckoutConnector = ({cart, setCart}) => {
    const { sessionId } = useCheckout();
    const query = useQuery();
    const paymentReference = useRef('')

    const getPaymentInformation = async (payment_intent_id) => {
        let response = await fetch(`${BACKEND_URL}/payment-intent/${payment_intent_id}`,
          {
              headers:{
                  ...DEV_REQUEST_HEADERS
              }
          }
        )
        const payment_intent = await response.json()
        paymentReference.current = payment_intent.metadata.ct_payment_id;
        fetch(`${BACKEND_URL}/cart/${payment_intent.metadata.cart_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...DEV_REQUEST_HEADERS
            },
        })
          .then((res) => res.json())
          .then((data) => {
              setCart(data);
          })
          .catch(e => console.log(e));
    };

    useEffect(() => {
        const payment_intent_id = query.get("payment_intent")
        if(payment_intent_id)
            getPaymentInformation(payment_intent_id);
    }, []);

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        //paymentFlow({
        checkoutFlow({
            projectKey: 'stripe-subscription',
            region: 'us-central1.gcp',
            paymentReference: paymentReference.current,
            sessionId: `${sessionId}`,
            logInfo: true,
            logWarn: true,
            logError: true,
            onInfo: (message ) => {
                console.log(`onInfo ${JSON.stringify(message,null,2)}`);
                if (message.code === 'checkout_completed') {
                    window.location.href = '/thank-you?orderId=' + message.payload.order.id;
                }
            },
            onWarn: (message) => {
                console.log(`onWarn ${JSON.stringify(message,null,2)}`);
            },
            onError: (message) => {
                console.log(`onError ${JSON.stringify(message,null,2)}`);
            },
            forms: {
                default: {
                    address: {
                        disableDefaultValidations: true,
                    }
                }
            }
        });
    },[sessionId])

    return (
      <div className="col-12">
        <div data-ctc className="checkout-Container" />
          { !sessionId &&
            <p>
                Your cart is empty, add products <a href="/" className="text-[#635bff] underline">here</a>
            </p>
          }
      </div>
    )
}

export default StripeCommercetoolsCheckoutConnector;
