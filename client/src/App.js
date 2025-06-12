// Modules
import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Confirmation from "./components/Confirmation";
import "./styles/index.css";
import Success from "./components/Success";
import WellKnowApplePay from "./components/WellKnowApplePay";
import CheckoutComposableConnector from "./components/CheckoutOrderConnector";
import CommercetoolsCheckoutConnector from "./components/CheckoutCtConnector";
import { useApi } from "./hooks/useApi";
import SubscriptionList from "./components/SubscriptionList";

export default function App() {
  const [cart, setCart] = useState();
  const [brandColor, setBrandColor] = useState("#425466");
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [ctCheckoutToggled, setCtCheckoutToggled] = useState(true);
  const [customerId, setCustomerId] = useState(null);
  const { createCart, updateCart, addCustomerToCart } = useApi();
  const currency = "usd";

  const addToCart = async ({ productId, quantity, variantId }) => {
    if (cart) {
      await handleUpdateCart({ cart, productId, quantity, variantId });
    } else {
      await handleCreateCart({ productId, quantity, variantId });
    }
    setTotalQuantity((prev) => parseInt(prev) + quantity);
  };

  const handleCreateCart = async ({ productId, quantity, variantId }) => {
    const newCart = await createCart(customerId);
    const updatedCart = await updateCart({
      cartId: newCart.id,
      quantity,
      productId,
      variantId,
      version: newCart.version,
    });
    setCart(updatedCart);
  };

  const handleUpdateCart = async ({ cart, productId, quantity, variantId }) => {
    const updatedCart = await updateCart({
      cartId: cart.id,
      productId,
      variantId,
      quantity,
      version: cart.version,
    });
    setCart(updatedCart);
  };

  const handleAddCustomerToCart = async (customerId) => {
    const newCart = cart
      ? await addCustomerToCart({ cartId: cart.id, customerId })
      : await createCart(customerId);
    setCart(newCart);
    setCustomerId(customerId);
  };

  const resetCart = () => {
    setCart(undefined);
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
            showCart={false}
            totalQuantity={totalQuantity}
          />
          <CommercetoolsCheckoutConnector cart={cart} setCart={setCart} />
        </Route>
        <Route path="/success/:capture_method">
          <Header
            cart={cart}
            resetCart={resetCart}
            brandColor={brandColor}
            setBrandColor={setBrandColor}
            currency={currency}
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
            showCart={true}
            totalQuantity={totalQuantity}
            ctCheckoutToggled={ctCheckoutToggled}
            setCtCheckoutToggled={setCtCheckoutToggled}
            setCustomerToCart={handleAddCustomerToCart}
          />
          {cart?.customerId && customerId === cart?.customerId ? (
            <SubscriptionList
              addToCart={addToCart}
              brandColor={brandColor}
              currency={currency}
            />
          ) : null}
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
