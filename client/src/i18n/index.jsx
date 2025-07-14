import React from "react";
import { useSelector } from "react-redux";
import { IntlProvider } from "react-intl";
import { messages } from "./messages";

const I18nProvider = ({ children }) => {
  const currentLocale = useSelector((state) => state.locale.locale);

  return (
    <IntlProvider
      locale={currentLocale}
      messages={messages[currentLocale]}
      defaultLocale="en-US"
    >
      {children}
    </IntlProvider>
  );
};

export default I18nProvider;
