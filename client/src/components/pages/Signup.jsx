import React, { useState } from "react";
import Input from "../Input.jsx";
import { useNavigate } from "react-router-dom";

function Signup() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const repsonse = await fetch(`${API_URL}/api/v1/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          email,
          password,
        }),
      });

      const data = await repsonse.json();
      console.log(data);

      if (!repsonse.ok) {
        throw new Error(data.message);
      }

      navigate("/login");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };
  return (
    <div className="">
      <form onSubmit={register} className="w-full h-screen mt-12">
        <div className="flex justify-center">
          <div className="mt-20 flex self-stretch flex-col bg-white/90 rounded-md border border-slate-300 px-10 py-5">
            <div className=" text-center font-serif">
              <h2 className="  font-semibold xl:text-xl text-black">
                Sign up to your account
              </h2>
            </div>

            <div className="mt-2">
              <label htmlFor="userName" className="font-serif text-sm py-2">
                userName
              </label>{" "}
              <br />
              <Input
                value={userName}
                type="text"
                placeholder="username"
                onChange={setUsername}
                className="border w-[20rem] border-black/35 rounded-md hover:border-indigo-900"
              />
            </div>

            <div className="mt-2">
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

            {error && <p className="text-red-700 text-center">{error}</p>}

            <button
              type="submit"
              className="w-[20rem] mt-5 py-1 bg-indigo-600 rounded-md shadow-md font-serif font-medium text-white/95"
            >
              Sign up
            </button>

            {/* <div className=" text-center font-semibold text-black mt-2 bg-gray-200 p-1">
              <p className=" rounded-lg text-black font-medium text-roman cursor-pointer underline">
                Don&apos;t have an Account?{" "}
                <Link to={"/login"}>
                  <span className="font-semibold">Login</span>
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signup;
