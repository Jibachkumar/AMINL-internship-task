import React, { useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

function Signup() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // special object for building multipart/form-data requests
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phoneNumber", number);
      formData.append("address", address);
      formData.append("coverImage", coverImage);

      const repsonse = await fetch(`${API_URL}/api/v1/users/register`, {
        method: "POST",
        body: formData,
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
      setAddress("");
      setNumber("");
      setCoverImage(null);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };
  return (
    <div className="bg-white">
      <form onSubmit={register} className="">
        <div className="flex justify-center">
          <div className="mt-20 flex self-stretch flex-col bg-white/90 rounded-md border border-slate-200 px-10 py-5">
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
              <label htmlFor="number" className="font-serif text-sm py-2">
                Phone Number
              </label>{" "}
              <br />
              <Input
                value={number}
                type="number"
                placeholder="number"
                onChange={setNumber}
                className="border w-[20rem] border-black/35 rounded-md hover:border-indigo-900"
              />
            </div>

            <div className="mt-2">
              <label htmlFor="address" className="font-serif text-sm py-2">
                Address
              </label>{" "}
              <br />
              <Input
                value={address}
                type="text"
                placeholder="address"
                onChange={setAddress}
                className="border w-[20rem] border-black/35 rounded-md hover:border-indigo-900"
              />
            </div>

            <div className="mt-2">
              <label className="font-serif text-sm  block">Cover Image</label>
              <div className="relative w-[20rem]">
                <label className="w-full outline-none py-[1px] bg-slate-200 rounded-sm hover:bg-slate-300 flex gap-x-2 items-center cursor-pointer">
                  <button type="button" className="text-sm">
                    Browse
                  </button>
                  <span>{coverImage ? coverImage.name : "Select a file"}</span>
                  <input
                    type="file"
                    onChange={(e) => setCoverImage(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>
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
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signup;
