import {React, useEffect, useState} from 'react'
import {decodeToken } from "react-jwt";
import {TopNav}  from '../../topnav/TopNav'
import './SendMessage.css'
import axios from 'axios'
export const SendMessage = () => {
  const [writersList, setWritersList] = useState([]);
  const [sendTo,setSendTo] = useState();
  const [message,setMessage] = useState();
  const [loggedInUser,setLoggedInUser] = useState();
  const myDecodedToken = decodeToken(localStorage.getItem('token'));
  const getWriters = async () => {
    await axios.get("http://localhost:5000/writers/getWriters").then((res) => {
      setWritersList(res.data);
    });
  };

  const submitHandler = async(e) =>{
      e.preventDefault();
      await axios.post('http://localhost:5000/messages/sendMessage',{
        to:sendTo,
        from:loggedInUser.userId,
        message
      })
      .then(res=>{
        console.log(res)
      })
  }
  useEffect(()=>{
    setLoggedInUser(myDecodedToken.payload)
    console.log(loggedInUser)
    getWriters();
 },[])
  return (
    <div className='message-container'>
      <TopNav/>


      <div className='sendmessage-form'>
      <form onSubmit={submitHandler} className='assign-form'>
        <div className='input'>
        <label>Assigned To:</label>
        <select value={sendTo} onChange={(e)=>setSendTo(e.target.value)}>
         {writersList.map(writer=> <option key={writer._id} value={writer._id}>{writer.email}</option>)}
        </select>
        </div>
        <div className='input'>
          <label>Message:</label>
          <textarea value={message} onChange={(e)=>{setMessage(e.target.value)}}>
          </textarea>
        </div>
        <button className='btn'>assign</button>
        </form>
      </div>
    </div>
  )
}
