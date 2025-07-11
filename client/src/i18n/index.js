import React from "react";
import { useSelector } from "react-redux";
import { IntlProvider } from "react-intl";

const I18nProvider = ({ children }) => {
  const currentLanguage = useSelector((state) => state.language.language);

  return (
    <IntlProvider locale={currentLanguage} defaultLocale="en-US">
      {children}
    </IntlProvider>
  );
};

export default I18nProvider;
