import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useApi } from "../hooks/useApi.js";

export default function ProductList({
  currency,
  brandColor,
  addToCart = async () => {},
}) {
  const { getProducts } = useApi();
  const [isLoaded, setIsLoaded] = useState(false);
  const [products, setProducts] = useState([]);

  // Fetch all products whenever currency is switched, or on initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoaded(false);
      const products = await getProducts(currency);
      setProducts(products);
    } finally {
      setIsLoaded(true);
    }
  };

  return !isLoaded ? (
    <div>Loading...</div>
  ) : (
    <div className="row row-cols-1 row-cols-lg-5 g-4">
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
