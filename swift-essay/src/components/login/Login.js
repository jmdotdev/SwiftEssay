import React from "react";
import "./Login.css";
import landingimage from '../../assets/images/login.webp'
import notepad from '../../assets/images/notepad.png'
export const Login = () => {
  return (
    <div className="main">
      <div className="left-section">
        <div className="landing-section">
            <img src={landingimage} alt="reader.png"/>
            <b><h3>SwiftEssay</h3></b>
            <p>Even if you don’t have sufficient statistics or ratings, we’ve got your back! You will still be able to get plenty of orders any time.</p>
        </div>
      </div>
      <div className="right-section">
        <div className="container">
          <div className="form-container">
          <div className="main-header">
            <div className="icon">
            <img  src={notepad} alt="notepad.png"/>
            <h3>SwiftEssay</h3>
            </div>
          </div>
          <div className="sign-in-header">
            <h3>Signin</h3>
            <p>Access Academic Writing panel using your email and password.</p>
          </div>
          <div className="form">
            <form>
                <label>Email:</label>
             <div className="input-control">
              <input type="email" placeholder="email" />
             </div>
              <label>Password:</label>
             <div className="input-control">
              <input type="password" placeholder="password" />
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
