import { useContext, useEffect, useState } from "react"
import { EnablerContext } from "../context/enablerContext"

export const useEnabler = () => {
    const enablerValue = useContext(EnablerContext);
 
    const [stripeSDK, setStripeSDK] = useState(null)
    const [elements, setElements] = useState(null)

    const [enablerElement, setEnablerElement] = useState([])

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

        return await enabler.createStripeElement({type, options})
            .then(element => {

                element.mount(selector);

                setEnablerElement(prev => [...prev, element]);
                
                return element
            })
            .catch(e => {
                console.error(e)
            })
    }


    return {
        enabler : enablerValue.enabler,
        stripe : stripeSDK,
        elements,
        createElement
    };
}