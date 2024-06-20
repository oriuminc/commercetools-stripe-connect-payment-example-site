import { useContext, useEffect, useState } from "react"
import { EnablerContext } from "../context/enablerContext"

export const useEnabler = () => {
    const enablerValue = useContext(EnablerContext);
 
    const [stripeSDK, setStripeSDK] = useState(null)
    const [elements, setElements] = useState(null)

    const [enablerElement, setEnablerElement] = useState(null)

    useEffect(() => {
        
        if (!enablerValue.enabler?.stripeSDK) return;
        
        enablerValue.enabler.stripeSDK
            .then(stripe => setStripeSDK(stripe));
        
    },[enablerValue.enabler?.stripeSDK])
    
    useEffect(() => {
        if (!enablerValue.enabler?.elements) return;

        setElements(enablerValue.enabler.elements);

    },[enablerValue.enabler?.elements])

    const createElement = async ({selector, type, options}) => {
        const enabler = await enablerValue.enabler;

        if(!enabler) return;

        enabler.createStripeElement({type, options})
        .then(element => {
            element.mount(selector);
            setEnablerElement(element);
            return element
        })
        .catch(e => console.error(e))
    }

    const submit = async () => {
        if(!enablerElement) return;

        return await enablerElement.submit();
    }

    return {
        enabler : enablerValue.enabler,
        stripe : stripeSDK,
        elements,
        createElement,
        submit
    };
}