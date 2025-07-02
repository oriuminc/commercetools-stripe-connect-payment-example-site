export const parseAttributeValue = (value) => {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    if (typeof value === "string" && !isNaN(Date.parse(value))) {
      const date = new Date(value);
      return date.toLocaleString();
    }
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return value["de-DE"] || value.label;
};

export const formatText = (text) => {
  const cleanedText = text.replace(/[-_]/g, " ");
  return cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1);
};

export const formatAttributeValue = (name) => {
  return formatText(parseAttributeValue(name));
}
