import React from 'react'
import './SideNav.css'
import notepad from '../../assets/images/notepad.png'
export const SideNav = () => {
  return (
    <div className='sidenav'>
     <div className='sidenav-header'>
     <img  src={notepad} alt="notepad.png"/>
            <b><h3>SwiftEssay</h3></b>
     </div>
      <ul>
        <li>Dashboard</li>
        <li>Writers</li>
        <li>Orders</li>
        <li>Alerts</li>
        <li>Payments</li>
        <li>Reviews</li>
        <li>News</li>
      </ul>
    </div>
  )
}
