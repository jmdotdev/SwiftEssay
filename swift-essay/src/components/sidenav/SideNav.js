import React from 'react'
import './SideNav.css'
import notepad from '../../assets/images/notepad.png'
export const SideNav = ({onLinkClick}) => {

  const handleSelectedLink = (link) =>{
    onLinkClick(link)
  }
  return (
    <div className='sidenav'>
     <div className='sidenav-header'>
     <img  src={notepad} alt="notepad.png"/>
            <b><h3>SwiftEssay</h3></b>
     </div>
      <ul>
        <li onClick={() => {handleSelectedLink("dashboard")}}>Dashboard</li>
        <li onClick={() => {handleSelectedLink("Writers")}}>Writers</li>
        <li onClick={() => {handleSelectedLink("Orders")}}>Orders</li>
        <li onClick={() => {handleSelectedLink("Messages")}}>Messages</li>
        <li onClick={() => {handleSelectedLink("Payments")}}>Payments</li>
        <li onClick={() => {handleSelectedLink("Reviews")}}>Reviews</li>
        <li onClick={() => {handleSelectedLink("News")}}>News</li>
      </ul>
    </div>
  )
}
