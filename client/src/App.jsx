// Modules
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Confirmation from "./components/Confirmation";
import Success from "./components/Success";
import WellKnowApplePay from "./components/WellKnowApplePay";
import CheckoutComposableConnector from "./components/CheckoutOrderConnector";
import CommercetoolsCheckoutConnector from "./components/CheckoutCtConnector";
import SubscriptionList from "./components/SubscriptionList";
import { useApi } from "./hooks/useApi";
import { fetchLanguages } from "./store/languageSlice";
import "./styles/index.css";

export default function App() {
  const [cart, setCart] = useState();
  const [brandColor, setBrandColor] = useState("#425466");
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [ctCheckoutToggled, setCtCheckoutToggled] = useState(true);
  const [customerId, setCustomerId] = useState(null);
  const dispatch = useDispatch();
  const { createCart, updateCart, addCustomerToCart } = useApi();
  const currency = "eur";

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
  const handleCtCheckoutToggled = (value) => {
    setCtCheckoutToggled(value);

    console.log("CT Checkout Toggled:", value);

    if (!cart && !value) {
      loginUserToCart();
    }
    if (value) {
      setCustomerId(null);
      setCart(undefined);
    }
  };
  const loginUserToCart = async () => {
    const newCart = await createCart("f1307a84-2890-437b-9213-2231a8e43413");
    setCart(newCart);
    setCustomerId("f1307a84-2890-437b-9213-2231a8e43413");
  };

  useEffect(() => {
    console.log("Cart updated:", cart);
    console.log("Customer ID:", customerId);
  }, [cart, customerId]);

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

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
            setCtCheckoutToggled={handleCtCheckoutToggled}
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
