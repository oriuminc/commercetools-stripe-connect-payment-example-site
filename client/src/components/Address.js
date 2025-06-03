import React, { useEffect, useState } from "react";

const Address = ({ elements }) => {
  const [stripeAuthElement, setStripeAuthElement] = useState(null);

  useEffect(() => {
    if (!elements || stripeAuthElement) return;

    const element = elements.create("address", {
      mode: "shipping",
      autocomplete: { mode: "automatic" },
    });
    setStripeAuthElement(element);
    element.mount("#address-element");
  }, [elements]);

  return <div id="address-element"></div>;
};

export default Address;
