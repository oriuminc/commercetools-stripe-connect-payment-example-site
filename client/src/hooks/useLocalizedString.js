import { useIntl } from "react-intl";

export const useLocalizedString = () => {
  const { locale, defaultLocale } = useIntl();

  return (localizedObject) => {
    if (!localizedObject || typeof localizedObject !== "object") return "";
    const fallbackLocale = defaultLocale || "en-US";

    return (
      localizedObject[locale] ||
      localizedObject[fallbackLocale] ||
      Object.values(localizedObject)[0] ||
      ""
    );
  };
};
