import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard.js";
import { DEV_REQUEST_HEADERS } from "../utils";
const BACKEND_URL = process.env.VERCEL_URL || "http://localhost:3000";

export default function ProductList(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [products, setProducts] = useState([]);

  // Fetch all products whenever currency is switched, or on initial load
  useEffect(() => {
    setIsLoaded(false);
    setProducts([]);
    fetch(`${BACKEND_URL}/api/products/` + props.currency, {
      headers: new Headers({
        ...DEV_REQUEST_HEADERS,
      }),
    })
      .then((res) => res.json())
      .then((obj) => {
        setProducts(obj);
        setIsLoaded(true);
      });
  }, [props.currency]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <div>
          <div className="row row-cols-1 row-cols-lg-5 g-4">
            {products.map((product, key) => (
              <ProductCard
                product={product}
                addToCart={props.addToCart}
                key={key}
                brandColor={props.brandColor}
                currency={props.currency}
              />
            ))}
          </div>
        </div>
      </>
    );
  }
}
