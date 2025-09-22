import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../Input";
function ResetPassword() {
  const API_URL = import.meta.env.VITE_API_URL;

  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(
        `${API_URL}/api/v1/users/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={resetPassword} className="bg-white w-full pt-40">
      {message === "" ? (
        <div className="w-xl border border-slate-400 mx-auto ">
          <h2 className="py-2 text-center font-sans bg-slate-50 font-semibold border-b border-b-slate-300">
            Reset Password
          </h2>
          <div className="w-full flex flex-col items-center p-5">
            <div>
              <label htmlFor="email" className="font-serif">
                Enter your new password
              </label>
              <br />
              <Input
                value={password}
                type="password"
                placeholder="Enter your password"
                onChange={setPassword}
                className="border w-[20rem] mt-1 py-1 border-black/35 rounded-sm hover:border-indigo-900"
              />
            </div>
            {error && <p className="text-red-700 font-serif">{error}</p>}
            <button
              type="submit"
              className="bg-orange-400 mt-5 py-1 w-[20rem] shadow-md cursor-pointer hover:scale-105 duration-300 ease-in-out"
            >
              Change Password
            </button>
          </div>
        </div>
      ) : (
        <p className="font-serif text-center mt-10 bg-gray-300 text-blue-900 w-xl mx-auto py-5">
          {message}
        </p>
      )}
    </form>
  );
}

export default ResetPassword;
