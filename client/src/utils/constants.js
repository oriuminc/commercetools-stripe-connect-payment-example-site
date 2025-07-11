export const SUBSCRIPTION_PRODUCT_TYPE_NAME = "subscription-information";

export const projectKey = process.env.REACT_APP_CT_PROJECT_KEY;

export const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PRODUCTION_URL || ""
    : "http://localhost:5000";

export const CURRENCIES = {
  AT: "EUR",
  AU: "AUD",
  BE: "EUR",
  BR: "BRL",
  CA: "CAD",
  CH: "EUR",
  CN: "CNY",
  DE: "EUR",
  ES: "EUR",
  FR: "EUR",
  GB: "GBP",
  IE: "EUR",
  IN: "INR",
  IT: "EUR",
  JP: "JPY",
  LU: "EUR",
  MX: "MXN",
  NL: "EUR",
  PT: "EUR",
  RU: "RUB",
  US: "USD",
  ZA: "ZAR",
};
