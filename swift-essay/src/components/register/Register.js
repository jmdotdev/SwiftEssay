import React from 'react'
import './Register.css'
import landingimage from '../../assets/images/login.webp'
import notepad from '../../assets/images/notepad.png'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
export const Register = () => {
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
            <h3>Sign Up</h3>
            <p>Create an account with us and guarantee constant work</p>
          </div>
          <div className="form">
            <form>
                <label>Email:</label>
             <div className="input-control">
             <EmailOutlinedIcon/>
              <input type="email" placeholder="email" />
             </div>
              <label>Password:</label>
             <div className="input-control">
             <LockOutlinedIcon/>
              <input type="password" placeholder="password" />
             </div>
             <label>Confirm Password:</label>
             <div className="input-control">
             <LockOutlinedIcon/>
              <input type="password" placeholder="confirm password" />
             </div>
              <button>Sign Up</button>
            </form>
            <h4>Forgot Password?</h4>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
