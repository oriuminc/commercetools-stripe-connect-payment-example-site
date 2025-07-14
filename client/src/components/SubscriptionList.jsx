import React, { useEffect, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import SwitchSelector from "react-switch-selector";
import ProductCard from "./ProductCard";
import { Spinner } from "./Spinner";
import { useApi } from "../hooks/useApi";

const SubscriptionList = ({
  currency,
  brandColor,
  addToCart = async () => {},
}) => {
  const { getSubscriptionProducts } = useApi();
  const [isLoaded, setIsLoaded] = useState(false);
  const [subscriptionProducts, setSubscriptionProducts] = useState([]);
  const [subscriptionInterval, setSubscriptionInterval] = useState(0);
  const intl = useIntl();

  const switchIntervalOptions = [
    {
      label: intl.formatMessage({
        id: "button.monthlySubscription",
      }),
      value: 0,
      selectedBackgroundColor: "#0bbfbf",
    },
    {
      label: intl.formatMessage({
        id: "button.yearlySubscription",
      }),
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
      setSubscriptionProducts(products);
    } finally {
      setIsLoaded(true);
    }
  };

  return !isLoaded ? (
    <div className="w-100 h-40 mb-[5rem] d-flex flex-col align-items-center">
      <p className="mb-8">
        <FormattedMessage
          id="label.loadingSubscriptionProducts"
          defaultMessage={"Loading subscription products..."}
        />
      </p>
      <Spinner width="50%" height="50%" />
    </div>
  ) : subscriptionProducts.length ? (
    <>
      <div className="flex flex-column gap-4">
        <h1 className="text-center text-xl">
          <FormattedMessage
            id="label.subscriptionProducts"
            defaultMessage={"Subscription Products"}
          />
        </h1>

        <div className="d-flex justify-content-center">
          <div style={{ maxWidth: "300px", width: "100%" }}>
            <SwitchSelector
              name="subscription-interval-switch"
              onChange={(value) => {
                console.log("Switching subscription interval to:", value);
                setSubscriptionInterval(value);
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
      <hr className="my-8 rounded-full bg-gray opacity-50 h-4" />
    </>
  ) : null;
};

export default SubscriptionList;
