import React, { useEffect, useState } from 'react'
import { useEnabler } from '../hooks/useEnabler'

const LinkAuthentication = ({setIsReady}) => {
    const {elements} = useEnabler();
    const [stripeAuthElement, setStripeAuthElement] = useState(null)

    const onChange =  (event) => {
        console.log({event})
        const email = event.value.email;

    }

    const onReady = () => {
        setIsReady(true)
    }

    useEffect(() => {
        if(!elements || stripeAuthElement) return;
        
        const element = elements.create("linkAuthentication");
        setStripeAuthElement(element)
            
        element.mount("#link-auth-element")
        element.on("change", onChange)
        element.on("ready", onReady)
    },[elements])

    return (
        <div id='link-auth-element'>
        </div>
    )
}

export default LinkAuthentication