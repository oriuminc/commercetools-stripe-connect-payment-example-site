import React, { useEffect, useState } from 'react'
import { useEnabler } from '../hooks/useEnabler'

const LinkAuthentication = () => {
    const {elements} = useEnabler();
    const [stripeAuthElement, setStripeAuthElement] = useState(null)

    useEffect(() => {
        if(!elements || stripeAuthElement) return;
        
        const element = elements.create("linkAuthentication");
        setStripeAuthElement(element)
            
        element.mount("#link-auth-element")
        
    },[elements])

    return (
        <div id='link-auth-element'>
        </div>
    )
}

export default LinkAuthentication