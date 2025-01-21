import React, { createContext, useEffect, useState } from "react";
import { getCTSessionId } from "../utils";

export const EnablerContext = createContext({
    processorUrl: null,
    sessionId: null,
});

const processorUrl = process.env.REACT_APP_PROCESOR_URL;

export const EnablerContextProvider = ({children, cartId}) => {

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
                processorUrl: processorUrl,
                sessionId: sessionId,
            }
        }>
            {children}
        </EnablerContext.Provider>
    )
}
