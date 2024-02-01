import React from 'react'
import './SideNav.css'
import notepad from '../../assets/images/notepad.png'
import { Link } from 'react-router-dom'
import { RxDashboard } from "react-icons/rx";
import { GiGraduateCap } from "react-icons/gi";
import { CiShoppingBasket } from "react-icons/ci";
import { TiMessages } from "react-icons/ti";
import { BsCashStack } from "react-icons/bs";


export const SideNav = () => {

  return (
    <div className='sidenav'>
     <div className='sidenav-header'>
     <img  src={notepad} alt="notepad.png"/>
            <b><h3>SwiftEssay</h3></b>
     </div>
      <ul>
        <li><Link className='sidenav-link'  to="dashboard"><div className='icon'><RxDashboard/></div>Dashboard</Link></li>
        <li><Link className='sidenav-link'  to="writers"><div className='icon'><GiGraduateCap/></div>Writers</Link></li>
        <li><Link className='sidenav-link'to="orders"><div className='icon'><CiShoppingBasket/></div>Orders</Link></li>
        <li><Link className='sidenav-link' to="Messages"><div className='icon'><TiMessages/></div>Messages</Link></li>
        <li><Link className='sidenav-link' to="payments"><div className='icon'><BsCashStack /></div>Payments</Link></li>
        {/* <li>Reviews</li>
        <li>News</li> */}
      </ul>
    </div>
  )
}
