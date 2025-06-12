import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from "../images/logo.svg";
import SwitchSelector from "react-switch-selector";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useApi } from "../hooks/useApi";

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
  const { getConfig } = useApi();
  const [isLoaded, setIsLoaded] = useState(false);
  const [shopName, setShopName] = useState();
  const [shopIcon, setShopIcon] = useState();
  const [showModal, setShowModal] = useState(false);
  const [userInput, setUserInput] = useState("");
  const iconColor = ctCheckoutToggled ? "#0d7575" : "#37309c";
  const switchSelectorOptions = [
    {
      label: "Checkout Connector",
      selectedBackgroundColor: "#0bbfbf",
    },
    {
      label: "Composable Connector",
      selectedBackgroundColor: "#6359ff",
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
      marginTop: 30,
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

  // On changing the currency, empty the cart
  useEffect(() => {
    resetCart();
  }, [currency]);

  const loadInitialData = async () => {
    const data = await getConfig();
    setShopName(data.shop_name);
    setBrandColor(data.primary_color);
    setIsLoaded(true);
    if (data.icon) {
      setShopIcon(data.icon);
    }
  };

  const handleUserSubmit = async () => {
    try {
      await setCustomerToCart(userInput);
      setShowModal(false);
    } catch (error) {
      console.error("Error setting customer to cart:", error);
      alert("Failed to set Customer ID.");
    }
  };

  return isLoaded ? (
    <>
      <Helmet>
        <title>{shopName}</title>
      </Helmet>
      <div className="row" style={styles.top}>
        <div className="col-3">
          <a href="/">
            <img src={shopIcon ?? logo} style={styles.icon} alt="icon" />
          </a>
        </div>
        {showCart ? (
          <>
            <div className="col-6" style={{ height: 50, marginTop: 30 }}>
              <SwitchSelector
                onChange={() => setCtCheckoutToggled((prev) => !prev)}
                options={switchSelectorOptions}
                initialSelectedIndex={0}
                fontSize={20}
              />
            </div>
            <div className="col-1 align-text-bottom" style={styles.cart}>
              <div
                onClick={() => setShowModal(true)}
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <FontAwesomeIcon icon={faUser} color={iconColor} />
              </div>

              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>User Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group>
                    <Form.Label>
                      Enter value e.g. 8c9dc3e9-09a1-45a4-91d0-8bbc0129b3dd
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Enter your value here"
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUserSubmit}
                    disabled={!userInput.trim()}
                  >
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div className="col-2 align-text-bottom" style={styles.cart}>
              <Link
                to={
                  ctCheckoutToggled
                    ? "/checkoutCtConnector"
                    : "/checkoutOrderConnector"
                }
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FontAwesomeIcon icon={faShoppingCart} color={iconColor} />
                {" " + totalQuantity}
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </>
  ) : null;
}
