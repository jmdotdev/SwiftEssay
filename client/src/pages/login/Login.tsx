import React, { useState, useEffect } from "react";
import landingimage from '../../assets/images/login.webp'
import notepad from '../../assets/images/notepad.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';

type Props = {
  setAuth: boolean
}
export const Login = ({ setAuth }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};

    if (touched.email) {
      if (!email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Email is invalid";
      }
    }

    if (touched.password) {
      if (!password) {
        errors.password = "Password is required";
      } else if (password.length < 4) {
        errors.password = "Password must be at least 4 characters";
      }
    }

    setErrors(errors);
  };

  useEffect(() => {
    validate();
  }, [email, password, touched]);

  const handleBlur = (e) => {
    setTouched({
      ...touched,
      [e.target.name]: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (Object.keys(errors).length === 0 && email && password) {
      try {
        const res = await axios.post('http://localhost:5000/writers/login', {
          email, password
        });
        localStorage.setItem('token', res.data.token);
        setAuth(true);
        toast.success("Login Successful");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Login Failed");
      }
    } else {
      toast.error("Please fix the errors before submitting");
    }
  };

  return (
    <div className="flex w-full min-w-screen h-full min-h-screen overflow-y-hidden">
      <div className="hidden md:flex items-center justify-center h-full md:w-1/2 bg-darkBlue text-white text-center">
        <div className="flex flex-col items-center h-1/2">
          <img src={landingimage} alt="reader.png" />
          <h3 className="font-bold text-3xl">SwiftEssay</h3>
          <p className="w-4/5 my-4">Even if you don’t have sufficient statistics or ratings, we’ve got your back You will still be able to get plenty of orders any time.</p>
        </div>
      </div>
      <div className="flex w-full items-center justify-start md:w-1/2 p-4 md:p-8">
      <div className="flex flex-col">
          <div className="flex items-center justify-start p-0">
          <img className="h-12 w-12 -ml-1" src={notepad} alt="notepad.png" />
          <h3 className="text-2xl font-bold text-darkBlue ml-1">Welcome Back!!</h3>
        </div>
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold">Signin</h3>
          <p className="text-md">Access the academic writing portal using your email and password.</p>
        </div>
        <div className="flex flex-col">
          <form onSubmit={handleSubmit} >
            <div className="w-full text-start my-2">
                <label className="font-semibold">Email:</label>
            </div>
            <div className="flex w-full input-control border-2 border-red-300">
              <input
                className="shadow-2xl h-12 w-full rounded-md px-2 focus:outline-0"
                type="email"
                name="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            <div className="w-full text-start my-2">
                <label className="font-semibold">Password:</label>
            </div>
            <div className="flex w-full input-control">
              <input
                className="shadow-2xl h-12 w-full rounded-md px-2 focus:outline-0"
                type="password"
                name="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handleBlur}
              />
              {touched.password && errors.password && <p className="text-red-500">{errors.password}</p>}
            </div>
            <div className="w-full text-start"> 
            <button className="bg-darkBlue text-white rounded-md mt-2 w-1/2 md:w-1/4 px-4 py-2 cursor-pointer">Sign In</button>
            </div>
          </form>
          <h4 className="my-2 cursor-pointer">Forgot Password?</h4>
        </div>
      </div>
      </div>
    </div>
  );
};
