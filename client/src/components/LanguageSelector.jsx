import React, { useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import {
  setCurrency,
  setLocale,
  updateAvailableLanguages,
} from "../store/localeSlice";
import { fetchCustomerSubscription } from "../store/customerSlice";
import { setCustomerId, setCustomerName } from "../store/customerSlice";
import { CUSTOMERS } from "../utils";
import "../styles/checkout.css";

const LanguageSelector = ({ brandColor, iconColor }) => {
  const customerId = useSelector((state) => state.customer.customerId);
  const currentLanguage = useSelector((state) => state.locale.locale);
  const availableLanguages = useSelector(
    (state) => state.locale.availableLanguages
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

  const onClickLanguageHandler = (locale) => {
    dispatch(setLocale(locale));
    dispatch(setCurrency(locale.split("-")[1]));
    dispatch(setCustomerId(CUSTOMERS[locale].id));
    dispatch(setCustomerName(CUSTOMERS[locale].name));
  };

  useEffect(
    () => dispatch(updateAvailableLanguages()),
    [dispatch, currentLanguage]
  );

  useEffect(
    () => dispatch(fetchCustomerSubscription(customerId)),
    [dispatch, customerId]
  );
  
  return (
    <>
      <div className="" style={styles.language}>
        <Dropdown>
          <Dropdown.Toggle
            as="button"
            className="flex items-center gap-1 shadow-none text-gray-700"
          >
            <FontAwesomeIcon icon={faGlobe} color={iconColor} />
            <p className="text-base text-gray-700">{currentLanguage}</p>
          </Dropdown.Toggle>
          <Dropdown.Menu className="mt-2 w-auto p-1 bg-white shadow-2xl text-base">
            {availableLanguages.map((language) => (
              <Dropdown.Item
                key={language.locale}
                onClick={() => onClickLanguageHandler(language.locale)}
                className={`flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded ${
                  currentLanguage === language.locale
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
