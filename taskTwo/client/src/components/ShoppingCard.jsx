import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ShoppingCard() {
  const API_URL = import.meta.env.VITE_API_URL;

  const location = useLocation();
  const navigate = useNavigate();

  const { product } = location.state || {};
  console.log(product);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleOrderProduct = async (e) => {
    e.preventDefault();
    try {
      const repsonse = await fetch(
        `${API_URL}/api/v1/orders/buy/${product.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
          },
          body: JSON.stringify({
            quantity,
          }),
          credentials: "include",
        }
      );

      const data = await repsonse.json();
      console.log(data);

      if (!repsonse.ok) {
        throw new Error(data.message);
      }

      if (data) {
        alert(`✅ Order placed successfully`);
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="bg-white max-w-2xl mx-auto mt-10 p-6 grid grid-cols-2 gap-8">
        {/* -------- Left Section (Image) -------- */}
        <div>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <img
              src={product.productImage?.url}
              alt={product.name}
              className="w-full h-[300px] object-cover"
            />
          </div>
        </div>

        {/* -------- Right Section (Details) -------- */}
        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>

          {/* Brand Info */}
          <p className="text-sm mb-2">
            Brand:{" "}
            <span className="text-blue-600 cursor-pointer">No Brand</span>
          </p>

          {/* Main Price Section */}
          <div className="mb-3">
            <p className="text-2xl font-bold text-orange-600">
              Rs. {product.price}
            </p>
          </div>

          {/* Color (if not specified, show placeholder) */}
          <div className="mb-3">
            <p className="text-sm mb-1">Watch Strap Color</p>
            <div className="flex gap-2">
              <div className="w-10 h-10 border-2 border-orange-500 rounded-md overflow-hidden">
                <img
                  src={product.productImage?.url}
                  alt="Selected color"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <form onSubmit={handleOrderProduct}>
            <div className="flex items-center gap-3 mb-5">
              <p className="text-sm">Quantity</p>
              <div className="flex items-center border border-slate-300 rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-xl font-bold text-gray-600"
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => (product.stock, q + 1))}
                  disabled={quantity === product.stock}
                  className="px-3 py-1 text-xl font-bold text-gray-600"
                >
                  +
                </button>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex gap-4">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition"
                type="submit"
              >
                Add to Cart
              </button>
            </div>
            {error && <p className="text-red-600 mt-3">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCard;
