import React, { createContext, useEffect, useState } from "react";
import { getCTSessionId } from "../utils";

export const EnablerContext = createContext({
    processorUrl: null,
    sessionId: null,
});

const processorOrderPageUrl = process.env.REACT_APP_PROCESOR_URL;
const processorOrderConnectorUrl = process.env.REACT_APP_PROCESOR_ORDER_CONNECTOR_URL;

export const EnablerContextProvider = ({children, cartId, orderConnector}) => {

    const [sessionId, setSessionId ] = useState(null)

    useEffect(() => {
        if(!cartId) return;

        const asyncCall = async () => {
            try{

                let sessionId = await getCTSessionId(cartId);
                setSessionId(sessionId);

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
                processorUrl: orderConnector ? processorOrderConnectorUrl: processorOrderPageUrl,
                sessionId: sessionId,
            }
        }>
            {children}
        </EnablerContext.Provider>
    )
}
