import { useIntl } from "react-intl";

export const useFormattedPrice = () => {
  const { formatNumber } = useIntl();

  const LOCALE_FORMAT_OPTIONS = {
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const NEITHER_COUNTRY_NOR_CURRENCY_OPTIONS = {
    currency: "USD",
    ...LOCALE_FORMAT_OPTIONS,
  };

  const getFormattedPrice = (price, hasCurrencyOrCountry, currency) =>
    hasCurrencyOrCountry
      ? formatNumber(price, { ...LOCALE_FORMAT_OPTIONS, currency })
      : formatNumber(price, { ...NEITHER_COUNTRY_NOR_CURRENCY_OPTIONS });

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

    let localizedPrice, amountType;
    let hasCurrencyOrCountry = false;

    if (isSubscriptionProduct) {
      localizedPrice = localizedPrices.find(
        (element) => element.value.currencyCode === currency
      );

      if (localizedPrice) {
        hasCurrencyOrCountry = true;
      } else {
        localizedPrice = localizedPrices.find(
          (element) => element.value.currencyCode === "USD"
        );
      }
    } else {
      localizedPrice = localizedPrices.find((element) => element.country === country);

      if (localizedPrice) {
        hasCurrencyOrCountry = true;
      } else {
        localizedPrice = localizedPrices.find((element) => element.country === "US");
      }
    }

    amountType = localizedPrice.value.type;
    localizedPrice = localizedPrice.value.centAmount;

    switch (amountType) {
      case "centPrecision":
        localizedPrice /= 100; // Convert cents to dollar
        break;
      default:
        localizedPrice /= 1; // No conversion needed
        break;
    }

    return getFormattedPrice(localizedPrice, hasCurrencyOrCountry, currency);
  };
};
