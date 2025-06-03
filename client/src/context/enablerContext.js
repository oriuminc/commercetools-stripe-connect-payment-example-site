import React, { createContext, useEffect, useState } from "react";
import { getCTSessionId } from "../utils";

export const EnablerContext = createContext({
  processorUrl: null,
  sessionId: null,
  enablerUrl: null,
});

const processorConfig = {
  composableConnectorProcessor:
    process.env.REACT_APP_COMPOSABLE_CONNECTOR_PROCESSOR_URL,
  commercetoolsCheckoutConnectorProcessor:
    process.env.REACT_APP_COMMERCETOOLS_CHECKOUT_CONNECTOR_PROCESSOR_URL,
};
const enablerConfig = {
  composableConnectorEnabler:
    process.env.REACT_APP_COMPOSABLE_CONNECTOR_ENABLER_URL,
  commercetoolsCheckoutConnectorEnabler:
    process.env.REACT_APP_COMMERCETOOLS_CHECKOUT_CONNECTOR_ENABLER_URL,
};

export const EnablerContextProvider = ({ children, cartId, connector }) => {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (!cartId) return;

    const asyncCall = async () => {
      try {
        let sessionId = await getCTSessionId(cartId);
        setSessionId(sessionId);
      } catch (e) {
        console.error(e);
        return null;
      }
    };
    asyncCall();
  }, [cartId]);

  return (
    <EnablerContext.Provider
      value={{
        processorUrl: processorConfig[connector],
        sessionId: sessionId,
        enablerUrl: enablerConfig[connector],
      }}
    >
      {children}
    </EnablerContext.Provider>
  );
};
