import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const AccordionCustomToggle = ({ children, eventKey, callback }) => {
    const [isOpen, setIsOpen] = useState(false);

    const decoratedOnClick = useAccordionToggle(eventKey, () => {
      setIsOpen(!isOpen);
      if (callback) callback(eventKey);
    });

    return (
      <Card.Header
        onClick={decoratedOnClick}
        className="d-flex justify-content-between align-items-center cursor-pointer"
      >
        {children}
        <FontAwesomeIcon
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          icon={faChevronDown}
        />
      </Card.Header>
    );
  };

export default AccordionCustomToggle;