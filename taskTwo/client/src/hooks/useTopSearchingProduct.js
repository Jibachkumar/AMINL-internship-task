import { useState, useEffect, useCallback } from "react";

export const useTopSearchingProduct = (startDate, endDate) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [searchedProduct, setSearchedProduct] = useState(null);
  const [error, setError] = useState("");

  const fetchTopSearchingProduct = useCallback(async () => {
    setError("");
    setSearchedProduct(null);

    try {
      const response = await fetch(
        `${API_URL}/api/v1/searches/top-search-product?startDate=${startDate}&endDate=${endDate}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setSearchedProduct(data);
    } catch (error) {
      setError(error.message);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchTopSearchingProduct();
  }, [startDate, endDate]);

  return { searchedProduct, error };
};
