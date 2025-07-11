import { useIntl } from "react-intl";

export const useFormattedPrice = () => {
  const { formatNumber } = useIntl();

  return (
    localizedPrices,
    country,
    currency,
    isSubscriptionProduct = false
  ) => {
    if (!localizedPrices || typeof localizedPrices !== "object") {
      return "";
    }
    if (!country) {
      console.warn("Country is required for formatting price.");
      return "";
    }

    let price;
    const LOCALE_FORMAT_OPTIONS = {
      style: "currency",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };

    const NEITHER_COUNTRY_NOR_CURRENCY = formatNumber(0, {
      currency: "USD",
      ...LOCALE_FORMAT_OPTIONS,
    });

    if (isSubscriptionProduct) {
      console.log("Subscription product detected, using first price.");
      console.log(localizedPrices);
      price = localizedPrices.find(
        (element) => element.value.currencyCode === currency
      );
      if (price) {
        if (price.value.type === "centPrecision") {
        price = price.value.centAmount / 100; // Convert cents to dollars
      }
        return formatNumber(price, {
          currency,
          ...LOCALE_FORMAT_OPTIONS,
        });
      }
      return NEITHER_COUNTRY_NOR_CURRENCY;
    }

    price = localizedPrices.find((element) => element.country === country);
    if (price) {
      if (price.value.type === "centPrecision") {
        price = price.value.centAmount / 100; // Convert cents to dollars
      }
      return formatNumber(price, {
        currency,
        ...LOCALE_FORMAT_OPTIONS,
      });
    }

    return NEITHER_COUNTRY_NOR_CURRENCY
  };
};
