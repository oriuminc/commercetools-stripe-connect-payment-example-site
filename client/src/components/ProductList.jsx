import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import ProductCard from "./ProductCard";
import { Spinner } from "./Spinner.jsx";
import { useApi } from "../hooks/useApi.js";

export default function ProductList({
  brandColor,
  addToCart = async () => {},
}) {
  const { getProducts } = useApi();
  const currency = useSelector((state) => state.locale.currency);
  const [isLoaded, setIsLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      setIsLoaded(false);
      const products = await getProducts(currency);
      setProducts(products);
    } finally {
      setIsLoaded(true);
    }
  };

  // Fetch all products whenever currency is switched, or on initial load
  useEffect(() => {
    fetchProducts();
  }, [currency]);

  return !isLoaded ? (
    <div className="w-100 h-100 flex flex-column justify-content-start align-items-center">
      <p className="text-lg mb-8">
        <FormattedMessage
          id="label.loadingProducts"
          defaultMessage={"Loading products…"}
        />
      </p>
      <Spinner width="16%" height="16%" />
    </div>
  ) : (
    <div className="row row-cols-1 row-cols-lg-5 g-4 pb-[2.5rem]">
      {products.map((product, key) => (
        <ProductCard
          product={product}
          addToCart={addToCart}
          key={key}
          brandColor={brandColor}
          currency={currency}
        />
      ))}
    </div>
  );
}
