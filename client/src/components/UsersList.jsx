import React from "react";
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom";
import { FormattedMessage } from "react-intl";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useSelector, useDispatch } from "react-redux";
import { setCurrency, setLocale } from "../store/localeSlice";
import { setCustomerId, setCustomerName } from "../store/customerSlice";
import { COMMON_COLOURS, CUSTOMERS } from "../utils";

const UsersList = ({ isCheckoutConncertor, onCloseModal }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const availableCustomers = useSelector(
    (state) => state.customer.availableCustomers
  );
  const currentLocale = useSelector((state) => state.locale.locale);
  const numberOfSubscriptions = useSelector(
    (state) => state.customer.numberOfSubscriptions
  );

  const onClickUserHandler = (locale) => {
    dispatch(setLocale(locale));
    dispatch(setCurrency(locale.split("-")[1]));
    dispatch(setCustomerId(CUSTOMERS[locale].id));
    dispatch(setCustomerName(CUSTOMERS[locale].name));
    onCloseModal();
  };

  return (
    <div className="flex flex-column">
      <Card>
        <Card.Body>
          <Card.Title>
            <p className="text-3 h5 mb-2">
              <FormattedMessage
                id="label.loggedInUser"
                defaultMessage={"Currently logged-in user"}
              />
            </p>
          </Card.Title>
          <ListGroup as="ul">
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
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Body>
          <Card.Title>
            <FormattedMessage
              id="label.userSubscriptions"
              defaultMessage={"User Subscriptions"}
            />
          </Card.Title>
          <Card.Text as="div" className="flex flex-column align-items-start">
            <p className="inline-flex items-center">
              {numberOfSubscriptions === 0 ? (
                <FormattedMessage
                  id="label.userNoSubscriptions"
                  defaultMessage={
                    "The current user has no subscriptions available."
                  }
                />
              ) : (
                <>
                  <FormattedMessage
                    id="label.userAvailableSubscriptionsLabel"
                    defaultMessage={"The current user has"}
                  />
                  &nbsp;
                  <Badge
                    pill
                    className={`rounded-full ${
                      isCheckoutConncertor
                        ? COMMON_COLOURS[0].tailwindClass
                        : COMMON_COLOURS[1].tailwindClass
                    } text-white font-medium`}
                    text="dark"
                  >
                    <FormattedMessage
                      id="label.userAvailableSubscriptionsCount"
                      defaultMessage="{count, plural, one {# subscription} other {# subscriptions}}"
                      values={{ count: numberOfSubscriptions }}
                    />
                  </Badge>
                </>
              )}
            </p>
            {(numberOfSubscriptions > 0 && location.pathname !== "/subscriptions") && (
              <span className="mt-2">
                <FormattedMessage
                  id="label.userManageSubscriptionsLabel"
                  defaultMessage={"To manage subscriptions."}
                />
                &nbsp;
                <Link
                  to="/subscriptions"
                  className="text-[#635bff] underline"
                  onClick={onCloseModal}
                >
                  <FormattedMessage
                    id="button.clickHere"
                    defaultMessage={"Click here"}
                  />
                </Link>
              </span>
            )}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UsersList;
