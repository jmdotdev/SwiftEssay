import React from 'react'
import {TopNav} from  '../../topnav/TopNav'
import './AddOrder.css'
export const AddOrder = () => {
  return (
   <div className='main-container'>
    <TopNav />
     <div className='add-order-container'>
      <div className='add-order-form'>
        <div className='header'>
          <h2>Place an Order</h2>
          <p>Fast,Secure and Reliable</p>
        </div>
        <div className='order-form'>
         <form>
          <input type='text' placeholder='academic level dropdown'/>
          <input type='text' placeholder='type of paper dropdown'/>
          <input type='text' placeholder='discipline'/>
          <input type='text' placeholder='topic'/>
          <input type='text' placeholder='paper instructions'/>
          <input type='text' placeholder='academic materials (file)'/>
          <input type='text' placeholder='page format'/>
          <input type='number' placeholder= 'number of pages'/>
          <input type='text' placeholder='type of paper'/>
          <input type='text' placeholder='double or single'/>
          <input type='text' placeholder='deadline'/>
          <input type='text' placeholder='writer category'/>
         </form>
        </div>
      </div>
      <div className='checkout-section'>

      </div>
    </div>
   </div>
  )
}
