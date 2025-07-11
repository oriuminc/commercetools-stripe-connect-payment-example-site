import React, { useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { setLocale, updateAvailableLanguages } from "../store/languageSlice";
import "../styles/checkout.css";

const LanguageSelector = ({ brandColor, iconColor }) => {
  const currentLanguage = useSelector((state) => state.language.locale);
  const availableLanguages = useSelector(
    (state) => state.language.availableLanguages
  );
  const dispatch = useDispatch();
  const styles = {
    language: {
      color: brandColor,
      textAlign: "center",
      fontSize: "2.1em",
      cursor: "pointer",
    },
  };

  useEffect(
    () => dispatch(updateAvailableLanguages()),
    [dispatch, currentLanguage]
  );
  return (
    <>
      <div className="" style={styles.language}>
        <Dropdown>
          <Dropdown.Toggle
            as="button"
            className="flex items-center gap-1 shadow-none text-gray-700 hover:bg-blue-500 hover:shadow-xl"
          >
            <FontAwesomeIcon icon={faGlobe} color={iconColor} />
            <p className="text-base text-gray-700">{currentLanguage}</p>
          </Dropdown.Toggle>
          <Dropdown.Menu className="mt-2 w-auto p-1 bg-white shadow-2xl text-base">
            {availableLanguages.map((language) => (
              <Dropdown.Item
                key={language.code}
                onClick={() => dispatch(setLocale(language.code))}
                className={`flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded ${
                  currentLanguage === language.code
                    ? "bg-[rgb(209,213,219)] font-semibold"
                    : ""
                }`}
              >
                {language.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
};

export default LanguageSelector;
