import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import Modal from "react-bootstrap/Modal";
import Carousel from "./Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useLocalizedString } from "../hooks/useLocalizedString";
import { useFormattedPrice } from "../hooks/useFormattedPrice";
import getSymbolFromCurrency from "currency-symbol-map";
import { formatAttributeValue, formatText } from "../utils";

export default function ProductCard({
  product,
  brandColor,
  isSubscription = false,
  addToCart = async ({ productId, quantity, variantId }) => {},
  subscriptionInterval, // 1 for monthly, 0 for yearly
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(1);
  const [show, setShow] = useState(false);
  const [quantityValue, setQuantityValue] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const handleClose = () => setShow(false);
  const [buySubscription, setBuySubscription] = useState(false);
  const history = useHistory();
  const currentLocale = useSelector((state) => state.locale.locale);
  const currentCurrency = useSelector((state) => state.locale.currency);
  const { getLocalizedString, parseLocalizedAttributeValue } =
    useLocalizedString();
  const getFormattedPrice = useFormattedPrice();

  const handleQuantityChange = (event) => {
    setQuantityValue(parseInt(event.target.value));
  };

  const handleShow = () => {
    setShow(true);
    setQuantityValue(1);
  };

  const styles = {
    boxCard: {
      height: 200,
    },
    card: {
      maxHeight: 500,
      borderRadius: 5,
      boxShadow: "silver 0px 0px 6px 0px",
      cursor: "pointer",
      border: "1px solid silver",
    },
    price: {
      fontSize: "1.2em",
      fontWeight: 600,
    },
    nameModal: {
      fontSize: "1.5em",
      fontWeight: 500,
    },
    img: {
      maxHeight: 180,
      objectFit: "cover",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "10px",
      borderRadius: "5px 5px 0 0",
    },
  };

  const quantitySelectOptions = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
  ];

  const variants = useMemo(() => {
    if (
      !product.masterData?.current?.masterVariant ||
      !product.masterData?.current?.variants
    ) {
      return [];
    }

    return [
      product.masterData?.current?.masterVariant,
      ...product.masterData?.current?.variants,
    ];
  }, [product]);

  const selectedVariant = useMemo(() => {
    return variants.find(({ id }) => id === selectedVariantId) || null;
  }, [selectedVariantId]);

  const handleAddToCart = async (id) => {
    try {
      setIsLoading(true);
      await addToCart({
        productId: product.id,
        quantity: isSubscription ? 1 : parseInt(quantityValue),
        variantId: selectedVariantId,
      });
      setShow(false);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayPrice = (value) => {
    console.log(currentCurrency, value);
    if (!value) {
      return `${getSymbolFromCurrency(currentCurrency)} 100`;
    }
    return `${getSymbolFromCurrency(currentCurrency)} ${(
      value.centAmount / 100
    ).toFixed(value.fractionDigits)}`;
  };

  useEffect(() => {
    const asyncCall = async () => {
      await handleAddToCart();
      history.push("/checkoutOrderConnector");
    };
    if (buySubscription) {
      asyncCall();
    }
  }, [buySubscription]);

  return (
    <>
      <div className="col">
        {isSubscription && (
          <div style={styles.card} className="h-100">
            <div className="card-image" style={styles.boxCard}>
              <img
                alt="product"
                src={product.masterData.current.masterVariant.images[0]?.url}
                style={styles.img}
              />
            </div>
            <div className="card-body pb-[10px]">
              <p styles={styles.name}>
                {/* {product.masterData.current.name["de-DE"]} */}
                {getLocalizedString(product.masterData.current.name)}
              </p>
              <h3 style={styles.price}>
                {/* {subscriptionInterval === 1
                  ? displayPrice(
                      product.masterData.current.variants[0].prices[0]?.value
                    )
                  : getFormattedPrice(
                      product.masterData.current.masterVariant.prices,
                      currentLocale.split("-")[1],
                      currentCurrency,
                      true
                    )} */}
                {subscriptionInterval === 1
                  ? getFormattedPrice(
                      product.masterData.current.variants[0].prices,
                      currentLocale.split("-")[1],
                      currentCurrency,
                      true
                    )
                  : getFormattedPrice(
                      product.masterData.current.masterVariant.prices,
                      currentLocale.split("-")[1],
                      currentCurrency,
                      true
                    )}
              </h3>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: brandColor, color: "white" }}
                onClick={() => {
                  if (subscriptionInterval === 1) {
                    setSelectedVariantId(
                      product.masterData.current.variants[0].id
                    );
                    setBuySubscription(true);
                  } else {
                    setSelectedVariantId(
                      product.masterData.current.masterVariant.id
                    );
                    setBuySubscription(true);
                  }
                }}
              >
                <FormattedMessage
                  id="button.subscribe"
                  defaultMessage={"Subscribe"}
                />
              </button>
              <div className="col-7 flex flex-column gap-2">
                <p>
                  {getLocalizedString(product.masterData.current.description)}
                </p>
                {/* <p>{product.masterData.current.description["de-DE"]}</p> */}
                {subscriptionInterval === 1 ? (
                  <ul>
                    {product.masterData.current.variants[0].attributes.forEach(
                      ({ name, value }) => {
                        if (name === "trial_period_days")
                          return (
                            <li key={name}>
                              <strong className="font-medium">
                                {formatText(name)}:
                              </strong>{" "}
                              {formatText(parseLocalizedAttributeValue(value))}
                              {/* {formatAttributeValue(value)} */}
                            </li>
                          );
                      }
                    )}
                  </ul>
                ) : (
                  <ul>
                    {product.masterData.current.masterVariant.attributes.forEach(
                      ({ name, value }) => {
                        if (name === "trial_period_days")
                          return (
                            <li key={name}>
                              <strong className="font-medium">
                                {formatText(name)}:
                              </strong>{" "}
                              {formatText(parseLocalizedAttributeValue(value))}
                              {/* {formatAttributeValue(value)} */}
                            </li>
                          );
                      }
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {!isSubscription && (
          <div style={styles.card} className="h-100" onClick={handleShow}>
            <div className="card-image" style={styles.boxCard}>
              <img
                alt="product"
                src={product.masterData.current.masterVariant.images[0]?.url}
                style={styles.img}
              />
            </div>
            <div className="card-body pb-[10px]">
              <p styles={styles.name}>
                {getLocalizedString(product.masterData.current.name)}
                {/* {product.masterData.current.name["de-DE"]} */}
              </p>
              <h3 style={styles.price}>
                {
                  getFormattedPrice(
                    product.masterData.current.masterVariant.prices,
                    currentLocale.split("-")[1],
                    currentCurrency
                  )
                  // displayPrice(
                  //   product.masterData.current.masterVariant.prices[0]?.value
                  // )
                }
              </h3>
            </div>
          </div>
        )}
      </div>
      <Modal show={show} centered onHide={handleClose} size="xl">
        <Modal.Header style={styles.nameModal}>
          {getLocalizedString(product.masterData.current.name)}
          {/* {product.masterData.current.name["de-DE"]} */}
          <FontAwesomeIcon
            icon={faTimes}
            className="cursor-pointer"
            onClick={handleClose}
          />
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-4">
              <Carousel
                id={`modal_${product.id}`}
                images={[
                  product.masterData.current.masterVariant.images[0]?.url,
                ]}
              />
            </div>
            <div className="col-7 flex flex-column gap-2">
              <p>
                {getLocalizedString(product.masterData.current.description)}
              </p>
              {/* <p>{product.masterData.current.description["de-DE"]}</p> */}
              <ul>
                {selectedVariant.attributes.map(({ name, value }) => (
                  <li key={name}>
                    {/* <strong className="font-medium">{formatText(name)}:</strong>{" "} */}
                    {(() => {
                      console.log("Name:", name);
                      switch (name) {
                        case "productspec":
                          return (
                            <strong className="font-medium">
                              <FormattedMessage
                                id="label.productSpecifications"
                                defaultMessage={"Product Specifications"}
                              />
                              {`: `}
                            </strong>
                          );
                        case "color":
                          return (
                            <strong className="font-medium">
                              <FormattedMessage
                                id="label.productColor"
                                defaultMessage={"Product Color"}
                              />
                              {`: `}
                            </strong>
                          );

                        default:
                          return (
                            <strong className="font-medium">
                              {`${formatText(name)}:`}
                            </strong>
                          );
                      }
                    })()}
                    {formatText(parseLocalizedAttributeValue(value))}
                    {/* {formatAttributeValue(value)} */}
                  </li>
                ))}
              </ul>
              {variants?.length > 1 ? (
                <div className="flex flex-column gap-2">
                  <h4 className="font-medium pt-4">
                    <FormattedMessage
                      id="label.productVariants"
                      defaultMessage={"Variants"}
                    />
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {variants?.map(({ id }) => (
                      <label
                        key={id}
                        htmlFor={id}
                        className={`border px-4 py-2 rounded-lg hover:bg-gray-light hover:cursor-pointer ${
                          selectedVariantId === id ? "bg-gray-light" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="variant"
                          value={id}
                          id={id}
                          className="hidden"
                          onChange={() => setSelectedVariantId(id)}
                        />
                        <p>{id}</p>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {!isSubscription ? (
            <div className="col-2">
              <label className="flex gap-2 justify-end">
                <FormattedMessage
                  id="label.quantity"
                  defaultMessage={"Quantity"}
                />
                <select
                  value={quantityValue}
                  onChange={handleQuantityChange}
                  disabled={isLoading}
                >
                  {quantitySelectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}
          <div className="col-2">
            <button
              className="btn"
              type="button"
              style={{ backgroundColor: brandColor, color: "blue" }}
              id={product.id}
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              <FormattedMessage
                id="button.addToCart"
                defaultMessage={"Add to Cart"}
              />
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
