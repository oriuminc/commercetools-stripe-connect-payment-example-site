import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useApi } from "../hooks/useApi";
import SwitchSelector from "react-switch-selector";

const SubscriptionList = ({
  currency,
  brandColor,
  addToCart = async () => {},
}) => {
  const { getSubscriptionProducts } = useApi();
  const [isLoaded, setIsLoaded] = useState(false);
  const [subscriptionProducts, setSubscriptionProducts] = useState([]);
  const [subscriptionInterval, setSubscriptionInterval] = useState(0);
  const switchIntervalOptions = [
    {
      label: "Monthly",
      value: 0,
      selectedBackgroundColor: "#0bbfbf",
    },
    {
      label: "Yearly",
      value: 1,
      selectedBackgroundColor: "#6359ff",
    },
  ];

  useEffect(() => {
    fetchSubscriptionProducts();
  }, []);

  const fetchSubscriptionProducts = async () => {
    try {
      setIsLoaded(false);
      const products = await getSubscriptionProducts(currency);
      console.log("Fetched Subscription Products:", products);
      console.log(JSON.stringify(products, null, 2));
      setSubscriptionProducts(products);
    } finally {
      setIsLoaded(true);
    }
  };

  return !isLoaded ? (
    <p className="my-8">Subscription Products are loading...</p>
  ) : subscriptionProducts.length ? (
    <>
      <div className="flex flex-column gap-4">
        <h1 className="text-center text-xl">Subscription Products</h1>

        <div className="d-flex justify-content-center">
          <div style={{ maxWidth: "300px", width: "100%" }}>
          <SwitchSelector
            name="subscription-interval-switch"
            onChange={(value) => {
              console.log("Switching subscription interval to:", value);
              setSubscriptionInterval(value)
            }}
            options={switchIntervalOptions}
            initialSelectedIndex={0}
            fontSize={20}
          />
          </div>
        </div>
        <div className="row row-cols-1 row-cols-lg-3 g-4">
          {subscriptionProducts.map((product, key) => (
            <ProductCard
              product={product}
              addToCart={addToCart}
              key={key}
              brandColor={brandColor}
              currency={currency}
              isSubscription={true}
              subscriptionInterval={subscriptionInterval}
            />
          ))}
        </div>
      </div>
      <hr className="my-8 rounded-full bg-gray opacity-50" style={{ height: "4px" }} />
    </>
  ) : null;
};

export default SubscriptionList;
