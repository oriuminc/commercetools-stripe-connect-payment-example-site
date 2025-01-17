import React, { useEffect, useState } from "react";
import { useEnabler } from "../hooks/useEnabler";
import LinkAuthentication from "./LinkAuthentication";
import Address from "./Address";
import { updateCartShippingAddress } from "../utils";
import { Spinner } from "./Spinner";
import ExpressCheckout from "./ExpressCheckout";

const StripeCheckout = ({cart, setCart, paymentSuccess, getPaymentHandler}) => {

    const { elements, enabler, createElement } = useEnabler();

    const [isLoading, setIsLoading] = useState(false);
    const [paymentError, setPaymentError] = useState("")
    const [paymentElement, setPaymentElement] = useState(null)

    useEffect(() => {
        if(!paymentSuccess) return;
        console.log('paymentSuccess handler ----------'+paymentSuccess)
    },[paymentSuccess])

    useEffect(() => {
        if (!enabler) return;

        createElement({
            selector : "#payment",
            type : "payment",
            cart: {
                id : cart.id,
                version : cart.version
            },
            onError,
        }).then(element => {
            if (!element) return
            //element.onError = onError;
            setPaymentElement(element)
        }).catch(err => {
        });

    },[enabler])

    const onError  = ({type, message}) => {
        setPaymentError(message)
        console.error({type, message})
        setIsLoading(false)
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setPaymentError("")
        console.log('Pay clicked')
        if ( !paymentElement) { //TODO change for the paymentElement component clicked can be payment or express

            console.log(`clicked onSubmit error , ${paymentElement}`)
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        setIsLoading(true)
        try {
            const test2 = await paymentElement.submit();
            console.log(test2)
            const addressElement = elements.getElement('address');
            console.log('testing3')
            const {value} = await addressElement.getValue();
            const paymentIntent = getPaymentHandler();
            console.log(`test${paymentIntent}ing4`)
            await updateCartShippingAddress(cart, value);
            console.log('testing5'+ paymentSuccess)
            window.location = `${window.location.origin}/success/manual?payment_intent=${paymentIntent}&cart_id=${cart.id}`

        }catch(e) {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 w-8/12">
            <ExpressCheckout cart={cart} />
            or
            <form className="flex flex-col gap-4" id="test" onSubmit={onSubmit}>
                <div>
                    <h3>
                        Account
                    </h3>
                    <LinkAuthentication elements={elements}/>

                </div>
                <div>
                    <h3>
                        Address
                    </h3>
                    <Address elements={elements}/>
                </div>
                <div>
                    <h3>
                        Payment
                    </h3>
                    <div id="payment"></div>
                </div>
                <span className="text-[#df1c41]">
                    {paymentError}
                </span>
                <button disabled={isLoading} type="submit" className={`${!isLoading ? "bg-[#635bff]" : "bg-[#9d9dad]"} flex justify-center text-white text-lg font-medium p-3 rounded-md`}>
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
