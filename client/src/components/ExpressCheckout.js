import React, { useEffect } from 'react'
import { useEnabler } from '../hooks/useEnabler';
import { updateCartShippingAddress } from '../utils';

const ExpressCheckout = ({ cart }) => {

    const { enablerExpress, createElementExpress, } = useEnabler();

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
        console.log('enablerExpress')
        if (!enablerExpress) return;
        console.log('enablerExpress1')
        createElementExpress({
            selector: "#express",
            type: "expressCheckout",
            onComplete,
            onError,
        }).then(element => {
            console.log('enablerExpress create then')
            if (!element) return;

            //element.returnURL = `${window.location.origin}/success/${enabler.elementsConfiguration.captureMethod}?cart_id=${cart.id}&payment_method=express_checkout`
            element.returnURL = `${window.location.origin}/success?cart_id=${cart.id}&payment_method=express_checkout`
        });
    }, [enablerExpress])

    return (
        <div id="express"> </div>
    )
}

export default ExpressCheckout
