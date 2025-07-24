import React from "react";
import { FormattedMessage } from "react-intl";
import ListGroup from "react-bootstrap/ListGroup";
import { useSelector, useDispatch } from "react-redux";
import { setCurrency, setLocale } from "../store/localeSlice";
import { setCustomerId, setCustomerName } from "../store/customerSlice";
import { COMMON_COLOURS, CUSTOMERS } from "../utils";

const UsersList = ({ isCheckoutConncertor, onCloseModal }) => {
  const dispatch = useDispatch();
  const availableCustomers = useSelector(
    (state) => state.customer.availableCustomers
  );
  const currentLocale = useSelector((state) => state.locale.locale);

  const onClickUserHandler = (locale) => {
    dispatch(setLocale(locale));
    dispatch(setCurrency(locale.split("-")[1]));
    dispatch(setCustomerId(CUSTOMERS[locale].id));
    dispatch(setCustomerName(CUSTOMERS[locale].name));
    onCloseModal();
  };

  return (
    <>
      <ListGroup as="ul">
        <p className="text-3 mb-2">
          <FormattedMessage
            id="label.loggedInUser"
            defaultMessage={"Currently logged-in user"}
          />
        </p>
        {Object.entries(availableCustomers).map(([locale, customer]) => (
          <ListGroup.Item
            as="li"
            key={locale}
            onClick={() => onClickUserHandler(locale)}
            className={`cursor-pointer transition-colors duration-200 ${
              currentLocale === locale
                ? `${
                    isCheckoutConncertor
                      ? COMMON_COLOURS[0].tailwindClass
                      : COMMON_COLOURS[1].tailwindClass
                  } text-white font-medium`
                : "bg-gray-100 hover:bg-[#f3f4f6]"
            }`}
          >
            {`${customer.name} - ${customer.id.slice(-4)}`}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default UsersList;
