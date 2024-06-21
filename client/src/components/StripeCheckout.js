import React, { useEffect, useState } from "react";
import { useEnabler } from "../hooks/useEnabler";
import { AddressElement, LinkAuthenticationElement } from "@stripe/react-stripe-js";
import LinkAuthentication from "./LinkAuthentication";
import Address from "./Address";

const StripeCheckout = () => {

    const {stripe, elements, enabler, submit, createElement} = useEnabler();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(!enabler?.elementsConfiguration){
            return;
        }
        console.log(enabler.elementsConfiguration.captureMethod);
    }, [enabler])

    useEffect(() => {
        createElement({
            selector : "#payment",
            type : "payment"
        });
        
    },[enabler])

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true)
        const result = await submit(`${window.location.origin}/success/${enabler.elementsConfiguration.captureMethod}`);    
        console.log({result})
    }

    return (
        <>
            <form className="w-8/12 flex flex-col gap-4" id="test" onSubmit={onSubmit}>
                <div>
                    <h3>
                        Account
                    </h3>
                    <LinkAuthentication />
                </div>
                <div>
                    <h3>
                        Address
                    </h3>
                    <Address/>
                </div>
                <div>
                    <h3>
                        Payment
                    </h3>
                    <div id="payment"></div>
                    <div id="express"></div>
                </div>
                <button disabled={isLoading} className={`${!isLoading ? "bg-[#635bff]" : "bg-[#9d9dad]"} text-white text-lg font-medium p-3 rounded-md`}>Pay</button>
            </form>
        </>
    )
}

export default StripeCheckout;