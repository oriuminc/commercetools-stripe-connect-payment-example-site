import { useIntl } from "react-intl";
import { LOCALE_FORMAT_OPTIONS } from "../utils/constants";
export const useFormattedPrice = () => {
  const { formatNumber } = useIntl();

  const NEITHER_COUNTRY_NOR_CURRENCY_OPTIONS = {
    currency: "USD",
    ...LOCALE_FORMAT_OPTIONS,
  };

  const getFormattedPriceValue = (amount, amountType) => {
    switch (amountType) {
      case "centPrecision":
        return amount / 100; // Convert cents to dollars
      default:
        return amount / 1; // Default to no conversion
    }
  };

  const getFormattedPriceUtil = (price, hasCurrencyOrCountry, currency) =>
    hasCurrencyOrCountry
      ? formatNumber(price, { ...LOCALE_FORMAT_OPTIONS, currency })
      : formatNumber(price, { ...NEITHER_COUNTRY_NOR_CURRENCY_OPTIONS });

  const getFormattedPrice = (
    localizedPrice,
    country,
    currency,
    quantity = undefined
  ) => {
    if (!localizedPrice || typeof localizedPrice !== "object") {
      return "";
    }
    if (!country) {
      console.warn("Country is required for formatting price.");
      return "";
    }

    const hasCurrencyOrCountry =
      localizedPrice.country === country ||
      localizedPrice.currencyCode === currency;

    localizedPrice = getFormattedPriceValue(
      localizedPrice.centAmount,
      localizedPrice.type
    );

    return getFormattedPriceUtil(
      quantity !== undefined ? localizedPrice * quantity : localizedPrice,
      hasCurrencyOrCountry,
      currency
    );
  };

  const getFormattedPriceForLocale = (
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
      localizedPrice = localizedPrices.find(
        (element) => element.country === country
      );

      if (localizedPrice) {
        hasCurrencyOrCountry = true;
      } else {
        localizedPrice = localizedPrices.find(
          (element) => element.country === "US"
        );
      }
    }

    amountType = localizedPrice.value.type;
    localizedPrice = localizedPrice.value.centAmount;

    localizedPrice = getFormattedPriceValue(localizedPrice, amountType);

    return getFormattedPriceUtil(
      localizedPrice,
      hasCurrencyOrCountry,
      currency
    );
  };

  return { getFormattedPrice, getFormattedPriceForLocale };
};
