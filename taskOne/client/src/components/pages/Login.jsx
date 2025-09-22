import React, { useEffect, useState } from "react";
import Input from "../Input.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../store/authSlice.js";

function Login() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const repsonse = await fetch(`${API_URL}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });

      const data = await repsonse.json();
      console.log(data);

      if (!repsonse.ok) {
        throw new Error(data.message);
      }

      if (data) {
        dispatch(authLogin({ userData: data.user.loggedInUser }));
        navigate("/");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="w-full h-screen">
      <form onSubmit={login} className=" mt-12">
        <div className="flex justify-center">
          <div className="relative mt-20 flex self-stretch flex-col bg-white/90 rounded-md border border-slate-300 px-10 py-5">
            <div className=" text-center font-serif">
              <h2 className="  font-semibold xl:text-xl text-black">
                Sign in to your account
              </h2>
            </div>
            <div>
              <label htmlFor="email" className="font-serif text-sm py-2">
                Email
              </label>{" "}
              <br />
              <Input
                value={email}
                type="email"
                placeholder="email"
                onChange={setEmail}
                className="border w-[20rem] border-black/35 rounded-md hover:border-indigo-900"
              />
            </div>
            <div className=" mt-2">
              <label htmlFor="password" className="font-serif text-sm ">
                Password
              </label>{" "}
              <br />
              <Input
                value={password}
                type="password"
                placeholder="password"
                onChange={setPassword}
                className="border border-black/35 w-[20rem] rounded-md hover:border-indigo-900"
              />
            </div>
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-right relative ml-auto w-[7rem] font-sans text-sm font-medium text-indigo-900 my-4 cursor-pointer hover:scale-105 duration-300 ease-in-out"
            >
              Forgot Password?
            </button>

            {error && <p className="text-red-700 text-center mb-2">{error}</p>}

            <button
              type="submit"
              className="w-[20rem] py-1 bg-indigo-600 rounded-md shadow-md font-serif font-medium text-white/95 cursor-pointer hover:scale-105 duration-300 ease-in-out"
            >
              Sign in
            </button>

            <div className="mt-5">
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <h3 className="px-3 text-center font-serif text-xs text-gray-600">
                  or login with
                </h3>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="flex justify-center mt-3">
                <Link to={`${API_URL}/api/v1/users/google`}>
                  <button
                    type="button"
                    className="px-2 pb-[3px] bg-slate-300 text-black rounded-full hover:scale-105 duration-300 ease-in-out cursor-pointer"
                  >
                    <i className="fa-brands fa-google text-xs"></i>
                  </button>
                </Link>
              </div>
            </div>

            <div className=" text-center font-semibold text-black mt-2 bg-gray-200 p-1">
              <p className=" rounded-lg text-black font-medium text-roman cursor-pointer underline">
                Don&apos;t have an Account?{" "}
                <Link to={"/signup"}>
                  <span className="font-semibold">Sign up</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
