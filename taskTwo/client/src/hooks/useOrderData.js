import { useState, useEffect, useCallback } from "react";

export const useOrderData = (startDate, endDate) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");

  const fetchOrderProduct = useCallback(async () => {
    setError("");
    setOrderData(null);

    try {
      const response = await fetch(
        `${API_URL}/api/v1/orders/sales-status?startDate=${startDate}&endDate=${endDate}`
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      setOrderData(data);
    } catch (error) {
      setError(error.message);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchOrderProduct();
  }, [startDate, endDate]);

  return { orderData, error };
};
