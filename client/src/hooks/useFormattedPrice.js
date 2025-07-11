import { useIntl } from "react-intl";

export const useFormattedPrice = () => {
  const { formatNumber } = useIntl();

  return (price, currency) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "";
    }
    if (!currency) {
      console.warn("Currency is required for formatting price.");
      return "";
    }
    console.log("Formatting price:", price, "Currency:", currency);
    return formatNumber(price, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
}