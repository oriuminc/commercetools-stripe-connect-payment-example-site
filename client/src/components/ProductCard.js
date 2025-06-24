import React, { useMemo, useState } from "react";
import Carousel from "./Carousel";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import getSymbolFromCurrency from "currency-symbol-map";
import { formatAttributeValue, formatText } from "../utils";

export default function ProductCard({
  product,
  brandColor,
  currency,
  isSubscription = false,
  addToCart = async ({ productId, quantity, variantId }) => {},
  subscriptionInterval , // 1 for monthly, 0 for yearly
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    parseInt(product.masterData?.current?.masterVariant?.id) || 1
  );
  const [show, setShow] = useState(false);
  const [quantityValue, setQuantityValue] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const handleClose = () => setShow(false);

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

  const handleAddToCart = async () => {
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
    if (!value) {
      return `${getSymbolFromCurrency(currency)} 100`;
    }
    return `${getSymbolFromCurrency(currency)} ${(
      value.centAmount / 100
    ).toFixed(value.fractionDigits)}`;
  };

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
            <div className="card-body" style={{ paddingBottom: 10 }}>
              <p styles={styles.name}>
                {product.masterData.current.name["en-US"]}
              </p>
              <h3 style={styles.price}>
                { subscriptionInterval === 1 ?
                  (displayPrice(
                    product.masterData.current.variants[0].prices[0]?.value
                  ))
                  :
                  (displayPrice(
                    product.masterData.current.masterVariant.prices[0]?.value
                  ))
                }
              </h3>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: brandColor, color: "white" }}
                onClick={()=> {
                  if(subscriptionInterval === 1) {
                    setSelectedVariantId(product.masterData.current.variants[0].id);
                  } else {
                    setSelectedVariantId(product.masterData.current.masterVariant.id);
                  }
                  handleAddToCart()
                }}
              >
                Subscribe
              </button>
              <div className="col-7 flex flex-column gap-2">
                <p>{product.masterData.current.description["en-US"]}</p>
                { subscriptionInterval === 1 ?
                  <ul>
                    {product.masterData.current.variants[0].attributes.map(({ name, value }) => {
                      if(name === "trial_period_days")
                        return (<li key={name}>
                          <strong className="font-medium">{formatText(name)}:</strong>{" "}
                          {formatAttributeValue(value)}
                        </li>)
                    })}
                  </ul>
                  :
                  <ul>
                    {product.masterData.current.masterVariant.attributes.map(({ name, value }) => {
                      if(name === "trial_period_days")
                        return (<li key={name}>
                          <strong className="font-medium">{formatText(name)}:</strong>{" "}
                          {formatAttributeValue(value)}
                        </li>)
                    })}
                  </ul>
                }

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
            <div className="card-body" style={{ paddingBottom: 10 }}>
              <p styles={styles.name}>
                {product.masterData.current.name["en-US"]}
              </p>
              <h3 style={styles.price}>
                {
                  displayPrice(
                    product.masterData.current.masterVariant.prices[0]?.value
                  )
                }
              </h3>
            </div>
          </div>
        )}
      </div>
      <Modal show={show} centered onHide={handleClose} size="xl">
        <Modal.Header style={styles.nameModal}>
          {product.masterData.current.name["en-US"]}
          <FontAwesomeIcon
            icon={faTimes}
            style={{ cursor: "pointer" }}
            onClick={handleClose}
          />
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-4">
              <Carousel
                id={"modal_" + product.id}
                images={[
                  product.masterData.current.masterVariant.images[0]?.url,
                ]}
              />
            </div>
            <div className="col-7 flex flex-column gap-2">
              <p>{product.masterData.current.description["en-US"]}</p>
              <ul>
                {selectedVariant.attributes.map(({ name, value }) => (
                  <li key={name}>
                    <strong className="font-medium">{formatText(name)}:</strong>{" "}
                    {formatAttributeValue(value)}
                  </li>
                ))}
              </ul>
              {variants?.length > 1 ? (
                <div className="flex flex-column gap-2">
                  <h4 className="font-medium pt-4">Variants</h4>
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
                Quantity
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
              style={{ backgroundColor: brandColor, color: "blue" }}
              id={product.id}
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              Add to Cart
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
