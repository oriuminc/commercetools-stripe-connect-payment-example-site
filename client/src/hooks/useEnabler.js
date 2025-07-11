import { useContext, useState } from "react";
import { EnablerContext } from "../context/enablerContext";
import { loadEnabler } from "../utils";

export const useEnabler = () => {
  const enablerContext = useContext(EnablerContext);

  const [elements, setElements] = useState(null);

  const createElement = async ({ type, selector, onComplete, onError, currency }) => {
    if (!enablerContext.enablerUrl) {
      console.error("Enabler URL is not set.");
      return;
    }
    const { Enabler } = await loadEnabler(enablerContext.enablerUrl);
    if (!Enabler) {
      console.error("Enabler module could not be loaded.");
      return;
    }
    const enabler = new Enabler({
      processorUrl: enablerContext.processorUrl,
      sessionId: enablerContext.sessionId,
      currency,
      onComplete: ({ isSuccess, paymentReference, paymentIntent }) => {
        onComplete(paymentIntent,isSuccess, paymentReference);
      },
      onError: (err) => {
        onError(err);
      },
      paymentElementType: type,
    });

    if (!enabler) return;

    const builder = await enabler.createDropinBuilder("embedded");
    const component = await builder.build({
      showPayButton: !builder.componentHasSubmit,
    });
    component.mount(selector);
    setElements(component.baseOptions.elements);
    return component;
  };

  return {
    enabler: enablerContext.sessionId,
    elements,
    createElement,
  };
};

export const useCheckout = () => {
  const enablerContext = useContext(EnablerContext);
  return {
    sessionId: enablerContext.sessionId,
  };
};
