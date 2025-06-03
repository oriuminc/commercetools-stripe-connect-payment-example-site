import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { DEV_REQUEST_HEADERS } from "../utils";
import logo from "../images/logo.svg";
import SwitchSelector from "react-switch-selector";


const BACKEND_URL =
  process.env.CURRENT_ENV === "production" ? process.env.NEXT_PUBLIC_VERCEL_URL : "http://localhost:3000";


export default function Header(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shopName, setShopName] = useState();
  const [shopIcon, setShopIcon] = useState();

  const styles = {
    top: {
      borderTop: "20px solid " + props.brandColor,
      marginTop: 30,
      paddingTop: 20,
      marginBottom: 40,
    },
    cart: {
      color: props.brandColor,
      textAlign: "center",
      fontSize: "2em",
      marginTop: 30,
    },
    title: {
      color: props.brandColor,
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
    fetch(`${BACKEND_URL}/api/settings/`, {
      headers: {
        ...DEV_REQUEST_HEADERS,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setShopName(data.shop_name);
        if (data.icon) setShopIcon(data.icon);
        props.setBrandColor(data.primary_color);
      })
      .then(() => setIsLoaded(true));
  }, []);

  // On changing the currency, empty the cart
  useEffect(() => {
    props.resetCart();
  }, [props.currency]);

  if (isLoaded) {
    return (
      <>
        <Helmet>
          <title>{shopName}</title>
        </Helmet>
        <div className="row" style={styles.top}>
          <div className="col-3">
            <a href="/">
              <img
                src={shopIcon ? shopIcon : logo}
                style={styles.icon}
                alt="icon"
              />
            </a>
          </div>
          {props.showCart && (
            <>
              <div className="col-6" style={{ height: 50, marginTop: 30 }}>
                <SwitchSelector
                  onChange={() =>
                    props.setCtCheckoutToggled(!props.ctCheckoutToggled)
                  }
                  options={[
                    {
                      label: "Checkout Connector",
                      selectedBackgroundColor: "#0bbfbf",
                    },
                    {
                      label: "Composable Connector",
                      selectedBackgroundColor: "#6359ff",
                    },
                  ]}
                  initialSelectedIndex={0}
                  fontSize={20}
                />
              </div>
              <div className="col-3 align-text-bottom" style={styles.cart}>
                {/**<span>Create Order from connector</span-->**/}
                <Link
                  to={`${
                    props.ctCheckoutToggled
                      ? "/checkoutCtConnector"
                      : "/checkoutOrderConnector"
                  }`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    color={`${props.ctCheckoutToggled ? "#0d7575" : "#37309c"}`}
                  />{" "}
                  {props.totalQuantity}
                </Link>
              </div>
            </>
          )}
        </div>
      </>
    );
  } else {
    return "";
  }
}
