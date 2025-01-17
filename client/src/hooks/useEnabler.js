import { useContext, useState } from "react"
import { EnablerContext } from "../context/enablerContext"

export const useEnabler = () => {
    const enablerContext = useContext(EnablerContext);

    const [elements, setElements] = useState(null)


    const createElement = async ({selector, onError, onComplete}) => {
        const enabler = await enablerContext.enabler;

        if(!enabler) return;

        const builder = await enabler.createDropinBuilder('embedded');
        const component = await builder.build({
            showPayButton: !builder.componentHasSubmit,
        });
        component.mount(selector);
        setElements(component.baseOptions.elements)
        return component
    }

    const createElementExpress = async ({selector, type, options, onError, onComplete}) => {
        const enablerExpress = await enablerContext.enablerExpress;

        if(!enablerExpress) return;

        const builder = await enablerExpress.createDropinBuilder('embedded');
        const component = await builder.build({
            showPayButton: !builder.componentHasSubmit
        });
        component.mount(selector);
        setElements(component.baseOptions.elements)
        return component
    }


    return {
        enabler : enablerContext.enabler,
        enablerExpress: enablerContext.enablerExpress,
        elements,
        createElement,
        createElementExpress,
    };
}
