import React from 'react'
import './SideNav.css'
import notepad from '../../assets/images/notepad.png'
import { Link } from 'react-router-dom'
import { Banknote, GraduationCap, LayoutDashboard, ShoppingBag } from 'lucide-react';


export const SideNav = () => {

  return (
    <div className='sidenav'>
     <div className='sidenav-header'>
     <img  src={notepad} alt="notepad.png"/>
            <b><h3>SwiftEssay</h3></b>
     </div>
      <ul>
        <li><Link className='sidenav-link'  to="dashboard"><div className='icon'><LayoutDashboard /></div>Dashboard</Link></li>
        <li><Link className='sidenav-link'  to="writers"><div className='icon'><GraduationCap /></div>Writers</Link></li>
        <li><Link className='sidenav-link'to="orders"><div className='icon'><ShoppingBag /></div>Orders</Link></li>
        <li><Link className='sidenav-link' to="payments"><div className='icon'><Banknote  /></div>Payments</Link></li>
        {/* <li>Reviews</li>
        <li>News</li> */}
      </ul>
    </div>
  )
}
