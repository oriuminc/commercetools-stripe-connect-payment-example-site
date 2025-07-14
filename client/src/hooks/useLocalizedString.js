import { useIntl } from "react-intl";

export const useLocalizedString = () => {
  const { locale, defaultLocale } = useIntl();
  const fallbackLocale = defaultLocale || "en-US";

  const getLocalizedString = (localizedObject) => {
    if (!localizedObject || typeof localizedObject !== "object") return "";

    return (
      localizedObject[locale] ||
      localizedObject[fallbackLocale] ||
      Object.values(localizedObject)[0] ||
      ""
    );
  };

  const parseLocalizedAttributeValue = (localizedValue) => {
  if (
    typeof localizedValue === "string" ||
    typeof localizedValue === "number" ||
    typeof localizedValue === "boolean"
  ) {
    if (typeof localizedValue === "string" && !isNaN(Date.parse(localizedValue))) {
      const date = new Date(localizedValue);
      return date.toLocaleString((locale || fallbackLocale));
    }
    return localizedValue.toString();
  }

  if (Array.isArray(localizedValue)) {
    return localizedValue.join(", ");
  }

  return localizedValue[locale] || localizedValue[defaultLocale] || localizedValue.label || "";
};

  return { getLocalizedString, parseLocalizedAttributeValue };
};
