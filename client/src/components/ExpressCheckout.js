import React, { useEffect } from 'react'
import { useEnabler } from '../hooks/useEnabler';
import { updateCartShippingAddress } from '../utils';

const ExpressCheckout = ({ cart }) => {

    const { enabler, createElement, } = useEnabler();

    const onError = (e) => {

    }

    const onComplete = async(e) => {
        const { billingDetails, shippingAddress } = e;

        let billingAlias = shippingAddress;

        if (!shippingAddress && billingDetails) {
            billingAlias = billingDetails;
        }

        await updateCartShippingAddress(cart, billingAlias)
    }

    useEffect(() => {
        if (!enabler) return;

        createElement({
            selector: "#express",
            type: "expressCheckout",
            onComplete,
            onError,
        }).then(element => {
            if (!element) return;

            element.returnURL = `${window.location.origin}/success/${enabler.elementsConfiguration.captureMethod}?cart_id=${cart.id}&payment_method=express_checkout`
        });
    }, [enabler])

    return ( 
        <div id="express"> </div>
    )
}

export default ExpressCheckout