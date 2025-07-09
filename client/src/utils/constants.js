export const SUBSCRIPTION_PRODUCT_TYPE_NAME = "subscription-information";

export const projectKey = process.env.REACT_APP_CT_PROJECT_KEY;

export const BACKEND_URL = process.env.NODE_ENV === "production"
  ? process.env.REACT_APP_PRODUCTION_URL || ''
  : "http://localhost:5000";