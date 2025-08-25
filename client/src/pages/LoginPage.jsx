import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { Authcontext } from "../../context/AuthContext";
import DotGrid from "../assets/BackgroundAnimation";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(Authcontext);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-6 sm:justify-center max-sm:flex-col backdrop-blur-2xl bg-black ">
      {/* DotGrid Background */}
      <div className="absolute inset-0 z-0">
        <DotGrid
          dotSize={1}
          gap={50}
          baseColor="#fff"
          activeColor="#5227FF"
          proximity={30}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      {/* Logo */}
      <img
        src={assets.logo}
        alt="Logo"
        className="w-[min(27vw,210px)] rounded shadow-lg h-20 mb-1 sm:mb-0 sm:mr-22"
      />

      <div className="flex flex-col items-center justify-center z-0">
        {/* Form */}
        <form
          onSubmit={onSubmitHandler}
          className="border-3 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg max-w-md w-full"
        >
          <h2 className="font-medium text-2xl flex justify-between items-center">
            {currState}
            {isDataSubmitted && (
              <img
                onClick={() => setIsDataSubmitted(false)}
                src={assets.arrow_icon}
                alt="Toggle"
                className="w-5 cursor-pointer"
              />
            )}
          </h2>
          {currState === "Sign up" && !isDataSubmitted && (
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              type="text"
              className="p-2 border border-gray-500 rounded-md focus:outline-none"
              placeholder="Full Name"
              required
            />
          )}

          {!isDataSubmitted && (
            <>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Address"
                required
                className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
                className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </>
          )}

          <button
            type="submit"
            className="py-3 bg-blue-500 text-white rounded-md cursor-pointer"
          >
            {currState === "Sign up" ? "Create Account" : "Login Now"}
          </button>

          <div className="flex items-center gap-2 text-sm text-black">
            <input type="checkbox" required />
            <p className="text-white">
              Agree to the terms of use & privacy policy.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {currState === "Sign up" ? (
              <p className="text-sm text-white">
                Already have an account?{"  "}
                <span
                  onClick={() => {
                    setCurrState("Login");
                    setIsDataSubmitted(false);
                  }}
                  className="font-medium text-violet-500 cursor-pointer"
                >
                  Login here
                </span>
              </p>
            ) : (
              <p className="text-sm text-white">
                Create an account{" "}
                <span
                  onClick={() => {
                    setCurrState("Sign up");
                  }}
                  className="font-medium text-violet-500 cursor-pointer"
                >
                  click here
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
