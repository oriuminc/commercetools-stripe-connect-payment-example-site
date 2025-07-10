import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import "../styles/checkout.css";

const LanguageSelector = ({ brandColor, iconColor }) => {
  const styles = {
    language: {
      color: brandColor,
      textAlign: "center",
      fontSize: "2.1em",
      cursor: "pointer",
    },
  };
  return (
    <>
      <div className="" style={styles.language}>
        <Dropdown>
          <Dropdown.Toggle
            as="button"
            className="flex items-center gap-1 shadow-none text-gray-700 hover:bg-blue-500 hover:shadow-xl"
          >
            <FontAwesomeIcon icon={faGlobe} color={iconColor} />
            <p className="text-base text-gray-700">ES</p>
          </Dropdown.Toggle>
          <Dropdown.Menu className="mt-2 w-40 p-1 bg-white shadow-2xl text-base">
            <Dropdown.Item className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded ">
              <span>Es</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
};

export default LanguageSelector;
