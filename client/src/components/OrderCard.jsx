import React from 'react'

export const OrderCard = ({orderCount,orderType,Icon}) => {
  return (
    <div className='dashboard-card'>
                <div className='left-section'>
                   <h2>{orderCount}</h2>
                   <h4>{orderType}</h4>
                </div>
                <div className='right-section'>
                   <img src={Icon} alt='orders-image.png'/>
                </div>
    </div>
  )
}
