import React, { useEffect, useState } from 'react'
import './TopNav.css'
import { IoSettingsOutline } from "react-icons/io5";
import { BiMessageDetail } from "react-icons/bi";
import { VscBellDot } from "react-icons/vsc";
import { IoMdLogOut } from "react-icons/io";
import avatar from '../../assets/images/avatar.webp'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom'
import verifyToken from '../../utils/verifyToken';
import axios from 'axios'
export const TopNav = () => {
  const [loggedInUser,setLoggedInUser] = useState(null)
  const [isLoggedIn,setIsLoggedIn] = useState(false)
  const [userNotifications,setUserNotifications] = useState([])
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();


  const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
  };
  const logout =() =>{
    localStorage.removeItem('token')
    navigate("/login")
   }
   const getUserInAppmessages = async () =>{
    await axios.get(`http://localhost:5000/messages/getUserMessages/${loggedInUser?.userId}`)
    .then(res=>{
      setUserNotifications(res.data.payload)
        console.log(res.data.payload)
    })
    .catch(err=>{
      console.log(err)
    })
}
   useEffect(() => {
    const fetchData = async () => {
      await verifyToken(setLoggedInUser, setIsLoggedIn, navigate);
      await getUserInAppmessages();
    };

    fetchData();
  }, [isLoggedIn]);
  return (
    <div className='topnavigation'>
        <form>
        <Paper
      component="form"
      sx={{ p: 'auto', display: 'flex', width: 400,}}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton type="button" sx={{ p: '10px'}} aria-label="search">
      <CiSearch />
      </IconButton>
    </Paper>
        </form>
        <div className='profile-section'>
         <div className={userNotifications.length > 0 ? 'notifications active' : 'notifications'} onClick={toggleDropdown}>
         <VscBellDot/>
         {showDropdown && (
                <div className="dropdown-content">
                    {userNotifications.map(notification => (
                        <p key={notification.id}>{notification.message}</p>
                    ))}
                </div>
            )}
         </div>
         <div className='logout' onClick={logout}>
         <IoMdLogOut/>
         logout
         </div>
         <Link to='/profile'>
         <div className='account'>
          <img src={avatar} alt='avatar.png'/>
         {loggedInUser?.username}
         </div>
         </Link>
        </div>
    </div>
  )
}
