import React from "react";
import { useSelector } from "react-redux";
import { IntlProvider } from "react-intl";

const I18nProvider = ({ children }) => {
  const currentLocale = useSelector((state) => state.locale.locale);

  return (
    <IntlProvider locale={currentLocale} defaultLocale="en-US">
      {children}
    </IntlProvider>
  );
};

export default I18nProvider;
