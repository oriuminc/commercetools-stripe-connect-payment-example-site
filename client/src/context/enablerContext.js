import React, { createContext, useEffect, useRef, useState } from "react";
import { getCTSessionId, loadEnabler } from "../utils";

export const EnablerContext = createContext({
    enabler : null
});

const procesorUrl = process.env.REACT_APP_PROCESOR_URL;

const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_PK;

export const EnablerContextProvider = ({children, cartId}) => {

    const [enabler, setEnabler] = useState(null)
    
    useEffect(() => {
        
        if(!cartId) return;
        
        const asyncCall = async () => {
            try{
                let { Enabler } = await loadEnabler();
                
                let sessionId = await getCTSessionId(cartId);
                
                setEnabler(new Enabler({
                    publishableKey : STRIPE_PUBLISHABLE_KEY,
                    processorURL : procesorUrl, 
                    returnURL : "",
                    sessionId,
                    onActionRequired : () => {},
                    onComplete: (e) => {
                        console.log({onSuccess : e})
                    },
                    onError : (e) => {
                        console.log({error : e})
                    }
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
                enabler
            }
        }>
            {children}
        </EnablerContext.Provider>
    )
}