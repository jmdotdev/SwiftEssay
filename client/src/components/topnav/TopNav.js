import React, { useEffect, useState } from 'react'
import './TopNav.css'
import { VscBellDot } from "react-icons/vsc";
import { IoMdLogOut } from "react-icons/io";
import avatar from '../../assets/images/avatar.webp'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom'
import {verifyToken} from '../../utils/verifyToken';
export const TopNav = () => {
  const [loggedInUser,setLoggedInUser] = useState(null)
  const [isLoggedIn,setIsLoggedIn] = useState(false)
  const navigate = useNavigate();

  const logout =() =>{
    localStorage.removeItem('token')
    navigate("/login")
   }
   
   useEffect(() => {
    const fetchData = async () => {
      await verifyToken(setLoggedInUser, setIsLoggedIn, navigate);
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
         <div>
         <VscBellDot/>
        
         </div>
         <div className='logout' onClick={logout}>
         <IoMdLogOut/>
         logout
         </div>
         <Link>
         <div className='account'>
          <img src={avatar} alt='avatar.png'/>
         {loggedInUser?.username}
         </div>
         </Link>
        </div>
    </div>
  )
}
