import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useApi } from "../hooks/useApi";

const SubscriptionList = ({
  currency,
  brandColor,
  addToCart = async () => {},
}) => {
  const { getSubscriptionProducts } = useApi();
  const [isLoaded, setIsLoaded] = useState(false);
  const [subscriptionProducts, setSubscriptionProducts] = useState([]);

  useEffect(() => {
    fetchSubscriptionProducts();
  }, []);

  const fetchSubscriptionProducts = async () => {
    try {
      setIsLoaded(false);
      const products = await getSubscriptionProducts(currency);
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
        <div className="row row-cols-1 row-cols-lg-5 g-4">
          {subscriptionProducts.map((product, key) => (
            <ProductCard
              product={product}
              addToCart={addToCart}
              key={key}
              brandColor={brandColor}
              currency={currency}
              isSubscription={true}
            />
          ))}
        </div>
      </div>
      <hr className="my-8 rounded-full bg-gray opacity-50" style={{ height: "4px" }} />
    </>
  ) : null;
};

export default SubscriptionList;
