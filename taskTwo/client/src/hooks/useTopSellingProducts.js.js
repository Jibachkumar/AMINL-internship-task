import { useState, useEffect, useCallback } from "react";

export const useTopSoldProduct = (startDate, endDate) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [topSoldProduct, setTopSoldProduct] = useState(null);
  const [error, setError] = useState("");

  const fetchTopSoldProduct = useCallback(async () => {
    setError("");
    setTopSoldProduct(null);

    try {
      const response = await fetch(
        `${API_URL}/api/v1/orders/top-order-product?startDate=${startDate}&endDate=${endDate}`
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      setTopSoldProduct(data);
    } catch (error) {
      setError(error.message);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchTopSoldProduct();
  }, [startDate, endDate]);

  return { topSoldProduct, error };
};
