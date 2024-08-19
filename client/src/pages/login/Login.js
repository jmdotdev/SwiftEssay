import React, { useState, useEffect } from "react";
import "./Login.css";
import landingimage from '../../assets/images/login.webp'
import notepad from '../../assets/images/notepad.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';

export const Login = ({ setAuth }) => {
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
    <div className="main">
      <div className="left-section">
        <div className="landing-section">
          <img src={landingimage} alt="reader.png" />
          <b><h3>SwiftEssay</h3></b>
          <p>Even if you don’t have sufficient statistics or ratings, we’ve got your back! You will still be able to get plenty of orders any time.</p>
        </div>
      </div>
      <div className="right-section">
        <div className="container">
          <div className="form-container">
            <div className="main-header">
              <div className="icon">
                <img src={notepad} alt="notepad.png" />
                <h3>Welcome Back!!</h3>
              </div>
            </div>
            <div className="sign-in-header">
              <h3>Signin</h3>
              <p>Access Academic Writing panel using your email and password.</p>
            </div>
            <div className="form">
              <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <div className="input-control">
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleBlur}
                  />
                  {touched.email && errors.email && <p className="error">{errors.email}</p>}
                </div>
                <label>Password:</label>
                <div className="input-control">
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handleBlur}
                  />
                  {touched.password && errors.password && <p className="error">{errors.password}</p>}
                </div>
                <button>Sign In</button>
              </form>
              <h4>Forgot Password?</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
