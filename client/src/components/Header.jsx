import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import Helmet from "react-helmet";
import { Link, useLocation } from "react-router-dom";
import SwitchSelector from "react-switch-selector";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import LanguageSelector from "./LanguageSelector";
import UsersList from "./UsersList";
import { useApi } from "../hooks/useApi";
import logo from "../images/logo.svg";
import { COMMON_COLOURS  } from "../utils";

export default function Header({
  brandColor,
  currency,
  showCart,
  totalQuantity,
  ctCheckoutToggled,
  setBrandColor = () => {},
  setCtCheckoutToggled = () => {},
  resetCart = () => {},
  setCustomerToCart = async () => {},
}) {
  // Temporarily disabled new customer input
  // const intl = useIntl();
  const { getConfig } = useApi();
  const [isLoaded, setIsLoaded] = useState(false);
  const [shopName, setShopName] = useState();
  const [shopIcon, setShopIcon] = useState();
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  // Temporarily disabled new customer input
  // const [userInput, setUserInput] = useState("");
  const iconColor = ctCheckoutToggled ? "#0d7575" : "#37309c";

  const switchSelectorOptions = [
    {
      label: "Checkout Connector",
      selectedBackgroundColor: COMMON_COLOURS[0].hexCode,
      value: true,
    },
    {
      label: "Composable Connector",
      selectedBackgroundColor: COMMON_COLOURS[1].hexCode,
      value: false,
    },
  ];

  const styles = {
    top: {
      borderTop: "20px solid " + brandColor,
      marginTop: 30,
      paddingTop: 20,
      marginBottom: 40,
    },
    cart: {
      color: brandColor,
      textAlign: "center",
      fontSize: "2em",
    },
    title: {
      color: brandColor,
      fontSize: "4em",
      letterSpacing: "-2px",
      fontWeight: 400,
    },
    subtitle: {
      fontSize: "1.5rem",
      fontStyle: "italic",
    },
    icon: {
      height: 70,
      float: "left",
      margin: "10px 20px 10px 10px",
    },
    switcher: {
      border: 0,
      marginRight: 30,
    },
  };

  // On intitial load only, retrieve branding details
  useEffect(() => {
    loadInitialData();
  }, []);

  // ToDo: Checkout this functionality
  // On changing the currency, empty the cart
  // useEffect(() => {
  //   resetCart();
  // }, [currency]);

  const loadInitialData = async () => {
    const data = await getConfig();
    setShopName(data.shop_name);
    setBrandColor(data.primary_color);
    setIsLoaded(true);
    if (data.icon) {
      setShopIcon(data.icon);
    }
  };

  // Temporarily disabled new customer input
  // const handleUserSubmit = async () => {
  //   try {
  //     await setCustomerToCart(userInput);
  //     setShowModal(false);
  //   } catch (error) {
  //     console.error("Error setting customer to cart:", error);
  //     alert("Failed to set Customer ID.");
  //   }
  // };

  return isLoaded ? (
    <>
      <Helmet>
        <title>{shopName}</title>
      </Helmet>
      <div className="row items-center" style={styles.top}>
        <div className="col-3">
          <a href="/">
            <img src={shopIcon ?? logo} style={styles.icon} alt="icon" />
          </a>
        </div>
        {showCart ? (
          <>
            <div className="col-6" style={{ height: 50 }}>
              <SwitchSelector
                name="checkout-switch"
                disabled={location.pathname === "/subscriptions"}
                onChange={(value) => setCtCheckoutToggled(value)}
                options={switchSelectorOptions}
                initialSelectedIndex={0}
                fontSize={20}
              />
            </div>
            <div className="flex items-center justify-around col-3">
              <div
                className="flex items-center leading-[0.9]"
                style={styles.cart}
              >
                <div
                  onClick={() => setShowModal(true)}
                  className="cursor-pointer"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <FontAwesomeIcon icon={faUser} color={iconColor} />
                </div>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton className="text-3xl">
                    <Modal.Title>
                      <FormattedMessage
                        id="label.userInformation"
                        defaultMessage={"User Information"}
                      />
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {/* Temporarily disabled new customer input */}
                    {/* <Form.Group className="mb-8">
                      <Form.Label>
                        <FormattedMessage
                          id="label.enterValue"
                          defaultMessage={"Enter a value"}
                        />
                        {" 8c9dc3e9-09a1-45a4-91d0-8bbc0129b3dd"}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={intl.formatMessage({
                          id: "label.enterValuePlaceholder",
                        })}
                      />
                    </Form.Group> */}
                    <UsersList
                      isCheckoutConncertor={ctCheckoutToggled}
                      onCloseModal={() => setShowModal(false)}
                    />
                    {/* <ListGroup as="ul">
                      <p className="text-3 mb-2">
                        <FormattedMessage
                          id="label.loggedInUser"
                          defaultMessage={"Currently logged-in user"}
                        />
                      </p>
                      {Object.entries(availableCustomers).map(
                        ([locale, customer]) => (
                          <ListGroup.Item
                            as="li"
                            key={locale}
                            onClick={() => onClickUserHandler(locale)}
                            className={`cursor-pointer transition-colors duration-200 ${
                              currentLocale === locale
                                ? `${
                                    ctCheckoutToggled
                                      ? COMMON_COLOURS[0].tailwindClass
                                      : COMMON_COLOURS[1].tailwindClass
                                  } text-white font-medium`
                                : "bg-gray-100 hover:bg-[#f3f4f6]"
                            }`}
                          >
                            {`${customer.name} - ${customer.id.slice(-4)}`}
                          </ListGroup.Item>
                        )
                      )}
                    </ListGroup> */}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                    >
                      <FormattedMessage
                        id="button.close"
                        defaultMessage="Close"
                      />
                    </Button>
                    {/* Temporarily disabled new customer input */}
                    {/* <Button
                      variant="primary"
                      onClick={handleUserSubmit}
                      disabled={!userInput.trim()}
                    >
                      <FormattedMessage
                        id="button.submit"
                        defaultMessage="Submit"
                      />
                    </Button> */}
                  </Modal.Footer>
                </Modal>
              </div>
              <LanguageSelector brandColor={brandColor} iconColor={iconColor} />
              <div style={{ ...styles.cart }}>
                <Link
                  to={
                    ctCheckoutToggled
                      ? "/checkoutCtConnector"
                      : "/checkoutOrderConnector"
                  }
                  className="flex items-center gap-2 cursor-pointer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <FontAwesomeIcon icon={faShoppingCart} color={iconColor} />
                  <span className="text-base">{totalQuantity}</span>
                </Link>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  ) : null;
}
