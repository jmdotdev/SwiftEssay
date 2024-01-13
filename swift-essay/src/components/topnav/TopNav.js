import React from 'react'
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
export const TopNav = () => {
  return (
    <div className='topnavigation'>
        <form>
        <Paper
      component="form"
      sx={{ p: '4px', display: 'flex', alignItems: 'center', width: 400}}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
      <CiSearch />
      </IconButton>
    </Paper>
        </form>
        <div className='profile-section'>
         <div className='settings'>
         <IoSettingsOutline />
         <p>settings</p>
         </div>
         <div className='notifications'>
         <BiMessageDetail />
         <VscBellDot/>
         </div>
         <div className='logout'>
         <IoMdLogOut/>
         logout
         </div>
         <div className='account'>
          <img src={avatar} alt='avatar.png'/>
         Admin
         </div>
        </div>
    </div>
  )
}
