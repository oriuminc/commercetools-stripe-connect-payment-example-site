export const SUBSCRIPTION_PRODUCT_TYPE_NAME = "subscription-information";

export const projectKey = process.env.REACT_APP_CT_PROJECT_KEY;

export const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL || ""
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

export const CUSTOMERS = {
  "de-DE": { id: "f1307a84-2890-437b-9213-2231a8e43413", name: "German User" },
  "en-US": {
    id: "8c9dc3e9-09a1-45a4-91d0-8bbc0129b3dd",
    name: "Default User US",
  },
  "en-GB": {
    id: "8c9dc3e9-09a1-45a4-91d0-8bbc0129b3dd",
    name: "Default User GB",
  },
};

export const COMMON_COLOURS = [
  { hexCode: "#0bbfbf", tailwindClass: "bg-custom-teal" },
  { hexCode: "#6359ff", tailwindClass: "bg-custom-indigo" },
];
