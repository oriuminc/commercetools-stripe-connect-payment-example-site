import React, { useEffect, useState } from "react";
import { useEnabler } from "../hooks/useEnabler";
import { AddressElement, LinkAuthenticationElement } from "@stripe/react-stripe-js";
import LinkAuthentication from "./LinkAuthentication";
import Address from "./Address";
import { updateCartShippingAddress } from "../utils";
import { Spinner } from "./Spinner";
import ExpressCheckout from "./ExpressCheckout";

const StripeCheckout = ({cart, setCart}) => {

    const {stripe, elements, enabler, createElement, } = useEnabler();

    const [isLoading, setIsLoading] = useState(false);

    //This elements are from the enabler, not the natives from stripe
    const [paymentElement, setPaymentElement] = useState(null)

    useEffect(() => {
        if(!enabler?.elementsConfiguration){
            return;
        }
    }, [enabler])

    useEffect(() => {
        if (!enabler) return;
        
        createElement({
            selector : "#payment",
            type : "payment",
            cart: {
                id : cart.id,
                version : cart.version
            }
        }).then(element => {
            if (!element) return

            element.onError = onError;
            setPaymentElement(element)
        });
        
    },[enabler])

    const onError  = (e) => {
        setIsLoading(false)
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true)

        try {

            const { error : submitError } = await elements.submit();

            if(submitError) {
                onError(submitError)
                return;
            }
            
            const addressElement = elements.getElement('address');
            
            const {value} = await addressElement.getValue();
            
            await updateCartShippingAddress(cart, value)
            
            paymentElement.returnURL = `${window.location.origin}/success/${enabler.elementsConfiguration.captureMethod}?cart_id=${cart.id}`
            
            await paymentElement.submit();
        }catch(e) {
            console.error(e)
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 w-8/12">
            <ExpressCheckout />
            or
            <form className="flex flex-col gap-4" id="test" onSubmit={onSubmit}>
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
                </div>
                <button disabled={isLoading} className={`${!isLoading ? "bg-[#635bff]" : "bg-[#9d9dad]"} flex justify-center text-white text-lg font-medium p-3 rounded-md`}>
                    {
                        isLoading ?
                        <Spinner />
                        :
                        "Pay"
                    }
                </button>
            </form>
        </div>
    )
}

export default StripeCheckout;