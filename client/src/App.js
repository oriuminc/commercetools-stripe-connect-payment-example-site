// Modules
import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Confirmation from "./components/Confirmation";
import "./styles/index.css";
import Success from "./components/Success";
import { DEV_REQUEST_HEADERS } from "./utils";
import WellKnowApplePay from "./components/WellKnowApplePay";
import CheckoutComposableConnector from "./components/CheckoutOrderConnector";
import CommercetoolsCheckoutConnector from "./components/CheckoutCtConnector";

const BACKEND_URL = process.env.NODE_ENV === "production"
  ? process.env.REACT_APP_PRODUCTION_URL || ''
  : "http://localhost:3000";

export default function App() {
  const [cart, setCart] = useState();
  const [brandColor, setBrandColor] = useState("#425466");
  const [currency, setCurrency] = useState("usd");
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [ctCheckoutToggled, setCtCheckoutToggled] = useState(true);
  const [customerId, setCustomerId] = useState(null);

  const addToCart = async (obj, quantity) => {
    setTotalQuantity(parseInt(totalQuantity) + quantity);
    if (!cart) {
      fetch(`${BACKEND_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...DEV_REQUEST_HEADERS,
        },
        body: JSON.stringify({
          customerId: customerId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setCart(data);
          updateCart(data.id, obj.id, null, quantity, 1);
        })
        .catch((e) => console.log(e));
    } else {
      updateCart(
        cart.id,
        obj.id,
        obj.masterData.current.masterVariant.id,
        quantity,
        cart.version
      );
    }
  };

  const updateCart = async (
    cartId,
    productId,
    variantId,
    quantity,
    version
  ) => {
    fetch(`${BACKEND_URL}/api/cart/line-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...DEV_REQUEST_HEADERS,
      },
      body: JSON.stringify({
        cartId: cartId,
        productId: productId,
        variantId: variantId,
        quantity: quantity,
        version: version,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
      });
  };

  const resetCart = () => {
    setCart();
  };

  const pickCurrency = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/checkoutOrderConnector">
          <Header
            cart={cart}
            resetCart={resetCart}
            brandColor={brandColor}
            setBrandColor={setBrandColor}
            currency={currency}
            pickCurrency={pickCurrency}
            showCart={false}
            totalQuantity={totalQuantity}
          />
          <CheckoutComposableConnector
            cart={cart}
            brandColor={brandColor}
            currency={currency}
            setCart={setCart}
          />
        </Route>
        <Route path="/checkoutCtConnector">
          <Header
            cart={cart}
            resetCart={resetCart}
            brandColor={brandColor}
            setBrandColor={setBrandColor}
            currency={currency}
            pickCurrency={pickCurrency}
            showCart={false}
            totalQuantity={totalQuantity}
          />
          <CommercetoolsCheckoutConnector
            cart={cart}
            brandColor={brandColor}
            currency={currency}
            setCart={setCart}
          />
        </Route>
        <Route path="/success/:capture_method">
          <Header
            cart={cart}
            resetCart={resetCart}
            brandColor={brandColor}
            setBrandColor={setBrandColor}
            currency={currency}
            pickCurrency={pickCurrency}
            showCart={false}
            totalQuantity={totalQuantity}
          />
          <Success />
        </Route>
        <Route path="/confirm">
          <Header
            cart={cart}
            resetCart={resetCart}
            brandColor={brandColor}
            setBrandColor={setBrandColor}
            currency={currency}
            pickCurrency={pickCurrency}
            showCart={false}
            totalQuantity={totalQuantity}
          />
          <Confirmation />
        </Route>
        <Route path="/.well-known/apple-developer-merchantid-domain-association">
          <WellKnowApplePay />
        </Route>
        <Route path="/">
          <Header
            cart={cart}
            resetCart={resetCart}
            brandColor={brandColor}
            setBrandColor={setBrandColor}
            currency={currency}
            pickCurrency={pickCurrency}
            showCart={true}
            totalQuantity={totalQuantity}
            ctCheckoutToggled={ctCheckoutToggled}
            setCtCheckoutToggled={setCtCheckoutToggled}
            setCustomerId={setCustomerId}
          />
          <ProductList
            addToCart={addToCart}
            brandColor={brandColor}
            currency={currency}
          />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
