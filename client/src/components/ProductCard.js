import React, { useState } from "react";
import Carousel from "./Carousel";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import getSymbolFromCurrency from "currency-symbol-map";

export default function ProductCard(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [quantityValue, setQuantityValue] = React.useState("1");
  const handleQuantityChange = (event) => setQuantityValue(event.target.value);

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
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
  ];

  const addToCart = (e) => {
    props.addToCart(props.product, parseInt(quantityValue));
    setShow(false);
  };


  const displayPrice = (value) => {
    if (!value) {
      return `${getSymbolFromCurrency(props.currency)} 100`;
    }
    return `${getSymbolFromCurrency(props.currency)} ${(
      value.centAmount / 100
    ).toFixed(value.fractionDigits)}`;
  };

  return (
    <>
      <div className="col">
        <div style={styles.card} className="h-100" onClick={handleShow}>
          <div className="card-image" style={styles.boxCard}>
            <img
              alt="product"
              src={
                props.product.masterData.current.masterVariant.images[0]?.url
              }
              style={styles.img}
            />
          </div>
          <div className="card-body" style={{ paddingBottom: 10 }}>
            <p styles={styles.name}>
              {props.product.masterData.current.name["en-US"]}
            </p>
            <h3 style={styles.price}>
              {displayPrice(
                props.product.masterData.current.masterVariant.prices[0]?.value
              )}
            </h3>
          </div>
        </div>
      </div>
      <Modal show={show} centered onHide={handleClose} size="xl">
        <Modal.Header style={styles.nameModal}>
          {props.product.masterData.current.name["en-US"]}
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
                id={"modal_" + props.product.id}
                images={[
                  props.product.masterData.current.masterVariant.images[0]?.url,
                ]}
              />
            </div>
            <div className="col-7">
              <p>{props.product.masterData.current.description["en-US"]}</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="col-1">
            <label>
              Quantity
              <select value={quantityValue} onChange={handleQuantityChange}>
                {quantitySelectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="col-2">
            <button
              className="btn"
              style={{ backgroundColor: props.brandColor, color: "blue" }}
              id={props.product.id}
              onClick={addToCart}
            >
              Add to Cart
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
