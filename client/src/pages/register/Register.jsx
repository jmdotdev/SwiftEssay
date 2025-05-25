import React, { useState } from "react";
import landingimage from "../../assets/images/login.webp";
import notepad from "../../assets/images/notepad.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
export const Register = () => {
  const [username, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const clearFields = () => {
    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      username === undefined ||
      email === undefined ||
      password === undefined ||
      confirmPassword === undefined
    ) {
      window.alert("please fill in all fields");
    } else if (password !== confirmPassword) {
      window.alert("password dont match");
    } else {
      await axios
        .post("http://localhost:5000/clients/registerClient", {
          username,
          email,
          password,
        })
        .then((res) => {
          toast.success("registration successfull");
        })
        .catch((err) => console.log(err));
      clearFields();
      toast.error("registration failed");
    }
  };
  return (
      <div className="flex w-full min-w-screen h-full min-h-screen overflow-y-hidden">
        <div className="hidden md:flex items-center justify-center h-full md:w-1/2 bg-darkBlue text-white text-center">
          <div className="flex flex-col items-center h-1/2">
            <img src={landingimage} alt="reader.png" />
            <h3 className="font-bold text-3xl">SwiftEssay</h3>
            <p className="w-4/5 my-4">
              Even if you don’t have sufficient statistics or ratings, we’ve got
              your back You will still be able to get plenty of orders any time.
            </p>
          </div>
        </div>
        <div className="flex w-full items-center md:w-1/2 p-4 md:p-8">
          <div className="flex flex-col w-[90vw] md:w-[40vw]">
            <div className="flex items-center justify-start p-0">
              <img
                className="h-12 w-12 -ml-1"
                src={notepad}
                alt="notepad.png"
              />
              <h3 className="text-2xl font-bold text-darkBlue ml-1 -mb-3">
                Join SwiftEssay!!
              </h3>
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-darkBlue">SignUp</h3>
              <p className="text-md">
                Create an account with us and guarantee constant work
              </p>
            </div>
            <div className="flex flex-col w-full">
              <form onSubmit={submitHandler}>
                <div className="w-full text-start my-2">
                  <label className="font-semibold">Username:</label>
                </div>
                <div className="flex w-full">
                  <input
                    className="shadow-2xl h-12 w-full rounded-md px-2 focus:outline-0"
                    type="email"
                    name="email"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="w-full text-start my-2">
                  <label className="font-semibold">Email:</label>
                </div>
                <div className="flex w-full ">
                  <input
                    className="shadow-2xl h-12 w-full rounded-md px-2 focus:outline-0"
                    type="email"
                    name="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="w-full text-start my-2">
                  <label className="font-semibold">Password:</label>
                </div>
                <div className="flex w-full ">
                  <input
                    className="shadow-2xl h-12 w-full rounded-md px-2 focus:outline-0"
                    type="password"
                    name="password"
                    placeholder="password"
                    value={email}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="w-full text-start my-2">
                  <label className="font-semibold">Confirm Password:</label>
                </div>
                <div className="flex w-full ">
                  <input
                    className="shadow-2xl h-12 w-full rounded-md px-2 focus:outline-0"
                    type="password"
                    name="confirm password"
                    placeholder="confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="w-full text-start">
                  <button className="bg-darkBlue text-white rounded-md mt-2 w-1/2 md:w-1/4 px-4 py-2 cursor-pointer">
                    Sign Up
                  </button>
                </div>
              </form>
              <Link to="/login">
                <h4 className="my-2 cursor-pointer">
                  Already have an account?{" "}
                  <a className="underline underline-offset-1">login</a>
                </h4>
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
};
