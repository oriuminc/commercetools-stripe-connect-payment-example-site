import { useEffect, useState } from "react";
import { useEnabler } from "../hooks/useEnabler";
import { AddressElement, LinkAuthenticationElement } from "@stripe/react-stripe-js";
import LinkAuthentication from "./LinkAuthentication";
import Address from "./Address";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const StripeCheckout = () => {

    const {stripe, elements, enabler, submit, createElement} = useEnabler();

    const [isReady, setIsReady] = useState(false)

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

        console.log(elements)
        debugger
        const result = await submit();    
        console.log({result})    
    }

    const getSkeleton = () => {
        return (
            <>
                <SkeletonTheme baseColor="#202020">
                    <Skeleton/>
                    <Skeleton count={5}/>
                    <Skeleton/>
                    <Skeleton count={5}/>
                    <Skeleton/>
                    <Skeleton count={5}/>
                </SkeletonTheme>
            </>
        )
    } 

    return (
        <>
            <form className="w-8/12 flex flex-col gap-4" id="test" onSubmit={onSubmit}>
                <div>
                    <h3>
                        Account
                    </h3>
                    <LinkAuthentication setIsReady={setIsReady}/>
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
                <button className="bg-[#635bff] text-white text-lg font-medium  p-3 rounded-md">Pay</button>
            </form>
        </>
    )
}

export default StripeCheckout;