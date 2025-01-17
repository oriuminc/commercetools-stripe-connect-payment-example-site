import React, { createContext, useEffect, useRef, useState } from "react";
import { getCTSessionId, loadEnabler } from "../utils";

export const EnablerContext = createContext({
    enabler : null,
    enablerExpress: null,
});

const processorUrl = process.env.REACT_APP_PROCESOR_URL;

export const EnablerContextProvider = ({children, cartId, paymentHandler}) => {

    const [enablerPayment, setEnablerPayment] = useState(null)
    const [enablerExpress, setEnablerExpress ]= useState(null)


    useEffect(() => {
        if(!cartId) return;

        const asyncCall = async () => {
            try{
                let { Enabler } = await loadEnabler();
                let sessionId = await getCTSessionId(cartId);

                setEnablerPayment(new Enabler({
                    processorUrl: processorUrl,
                    sessionId: sessionId,
                    currency: "EUR",
                    onComplete: ({ isSuccess, paymentReference, paymentIntent }) => {
                        console.log("onComplete2", { isSuccess, paymentReference, paymentIntent });
                        paymentHandler(paymentIntent)
                    },
                    onError: (err) => {
                        console.error("onError", err);
                    },
                    paymentElementType: 'payment',
                }))
                setEnablerExpress(new Enabler({
                    processorUrl: processorUrl,
                    sessionId: sessionId,
                    currency: "EUR",
                    onComplete: ({ isSuccess, paymentReference }) => {
                        console.log("onComplete", { isSuccess, paymentReference });

                    },
                    onError: (err) => {
                        console.error("onError", err);
                    },
                    paymentElementType: 'expressCheckout',
                }))

            } catch (e) {
                console.error(e);
                return null;
            }
        };
        asyncCall()
    },[cartId])

    return (
        <EnablerContext.Provider value={
            {
                enabler: enablerPayment,
                enablerExpress: enablerExpress,
            }
        }>
            {children}
        </EnablerContext.Provider>
    )
}
