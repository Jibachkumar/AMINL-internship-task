import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Input from "../Input";
import { login as authLogin } from "../../store/authSlice.js";

function Profile() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneMunber] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);

  const changeProfile = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/v1/users/update-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          userName,
          phoneNumber,
          address,
        }),
        credentials: "include",
      });

      const user = await response.json();

      if (!response.ok) {
        throw new Error(user.message);
      }

      if (user) {
        dispatch(authLogin({ userData: user.user }));
        setIsEditing(false);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-white">
      {/* Cover photo */}
      <div className="w-full  bg-slate-700 relative flex items-center justify-center">
        <div className="w-full h-[23rem] overflow-hidden">
          <img
            src={userData?.coverImage || "add coverImage"}
            alt="image"
            className="w-full h-[23rem] object-cover"
          />
        </div>

        {/* Profile card */}
        <div className="bg-white w-[85%] absolute top-80 left-1/2 -translate-x-1/2 rounded-sm shadow-md p-8 flex flex-col justify-between">
          <div className="font-serif space-y-2 text-center">
            <h2 className="font-semibold">
              Full Name:{" "}
              <span className="font-medium">{userData?.userName}</span>
            </h2>
            <h2 className="font-semibold">
              Address: <span className="font-medium">{userData?.address}</span>
            </h2>
            <h2 className="font-semibold">
              Phone Number:{" "}
              <span className="font-medium">{userData?.phoneNumber}</span>
            </h2>
            <h2 className="font-semibold">
              Email: <span className="font-medium">{userData?.email}</span>
            </h2>
          </div>
          <button
            className="mt-4 py-2 px-4 w-[15rem] mx-auto rounded-md border border-slate-300 hover:bg-slate-100 transition"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* edit profile */}
      {isEditing && (
        <div className="absolute top-64 left-1/2 -translate-x-1/2 z-50">
          <form onSubmit={changeProfile}>
            <div className="flex justify-center">
              <div className="mt-20 flex self-stretch flex-col bg-white rounded-md shadow-xl border border-slate-200 px-10 py-5">
                <div className=" text-center font-serif">
                  <h2 className="  font-semibold xl:text-xl text-black">
                    Update Profile Details
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
                    value={phoneNumber}
                    type="number"
                    placeholder="number"
                    onChange={setPhoneMunber}
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

                {error && <p className="text-red-700 text-center">{error}</p>}

                <button
                  type="submit"
                  className="w-[20rem] mt-5 py-1 bg-indigo-600 rounded-md shadow-md font-serif font-medium text-white/95"
                >
                  change profile
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Profile;
