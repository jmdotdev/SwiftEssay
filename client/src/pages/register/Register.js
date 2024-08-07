import React, { useState } from 'react'
import './Register.css'
import landingimage from '../../assets/images/login.webp'
import notepad from '../../assets/images/notepad.png'
import axios from 'axios'
import { toast } from 'react-toastify';
export const Register = () => {
  const[username,setUserName] = useState();
  const[email,setEmail]=useState();
  const[password,setPassword]= useState();
  const[confirmPassword,setConfirmPassword] = useState();

  const clearFields = () =>{
    setUserName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  const submitHandler = async (e) =>{
    e.preventDefault();
     if(username === undefined || email === undefined || password === undefined || confirmPassword === undefined){
      window.alert("please fill in all fields")
     }
     else if(password !== confirmPassword){
      window.alert("password dont match")
     }
     else{
      await axios.post('http://localhost:5000/clients/registerClient',{
        username,email,password
      }).then(res=>{
        toast.success("registration successfull")
      })
      .catch(err=>console.log(err))
      clearFields()
      toast.error("registration failed")
     }
  }
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
            <h3>Join SwiftEssay</h3>
            </div>
          </div>
          <div className="sign-in-header">
            <h3>Sign Up</h3>
            <p>Create an account with us and guarantee constant work</p>
          </div>
          <div className="form">
            <form onSubmit={submitHandler}>
            <label>Username:</label>
             <div className="input-control">
              <input type="text" placeholder="username" value={username} onChange={(e)=>setUserName(e.target.value)} />
             </div>
                <label>Email:</label>
             <div className="input-control">
              <input type="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
             </div>
              <label>Password:</label>
             <div className="input-control">
              <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
             </div>
             <label>Confirm Password:</label>
             <div className="input-control">
              <input type="password" placeholder="confirm password" value={confirmPassword}  onChange={(e)=>setConfirmPassword(e.target.value)}/>
             </div>
              <button>Sign Up         
              </button>
            </form>
            <h4>Forgot Password?</h4>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
