import React, { useEffect } from "react";
import { useCheckout } from "../hooks/useEnabler";
import { checkoutFlow } from "@commercetools/checkout-browser-sdk";

const StripeCommercetoolsCheckoutConnector = ({cart}) => {
    const { sessionId } = useCheckout();

    useEffect(() => {
        if (!sessionId) return;

        //paymentFlow({
        checkoutFlow({
            projectKey: 'stripe-subscription',
            region: 'us-central1.gcp',
            sessionId: `${sessionId}`,
            logInfo: true,
            logWarn: true,
            logError: true,
            onInfo: (message) => {
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
      </div>
    )
}

export default StripeCommercetoolsCheckoutConnector;
