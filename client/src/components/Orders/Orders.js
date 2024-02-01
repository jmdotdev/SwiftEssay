import React, { useState } from 'react'
import './Orders.css'
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import {TopNav}  from '../topnav/TopNav'
export const Orders = () => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'topic', headerName: 'Topic', width: 150 },
    { field: 'due', headerName: 'Due', width: 150 },
    {field: 'status',headerName: 'Status',type: 'number',width: 150},
    {field: 'client',headerName: 'Client',width: 150},
    {field: 'view',headerName: 'view',type: 'text',width: 150},
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Link to={`/orders/order-details/${params.row.id}`}>
          <button className='edit-order-btn'>View Order</button>
        </Link>
      ),
    },
  ];
  const rows = [
    { id: 1, due: 'Snow', topic: 'Jon', status: 35 ,client:'jayson',view:50},
    { id: 2, due: 'Lannister', topic: 'Cersei', status: 42, client:'jayson',view:50},
    { id: 3, due: 'Lannister', topic: 'Jaime', status: 45 ,client:'jayson',view:50},
    { id: 4, due: 'Stark', topic: 'Arya', status: 16,client:'jay',view:50 },
    { id: 5, due: 'Targaryen', topic: 'Daenerys', status: null,client:'Son' ,view:50},
    { id: 6, due: 'Melisandre', topic: null, status: 150,client:'jays',view:50 },
    { id: 7, due: 'Clifford', topic: 'Ferrara', status: 44,client:'john' ,view:50},
    { id: 8, due: 'Frances', topic: 'Rossini', status: 36 ,client:'jayson',view:50},
    { id: 9, due: 'Roxie', topic: 'Harvey', status: 65 ,client:'jay',view:50},
  ];


  return (
    <div className='orders-section'>
      <TopNav />
     {<div>
      <div className='orders-header'>
        <h4>Orders</h4>
        <Link className='link' to="add-order"><button className='add-order-btn'>Add Order</button></Link>
      </div>
      <div className='order-filters'>
        <a>Available<span>0</span></a>
        <a>Assigned</a>
        <a>Pending</a>
        <a>Completed</a>
        <a>Revision</a>
        <a>Progress</a>
        <a>Cancelled</a>
        <a>Approved</a>
      </div>
      <div className='orders-list'>
      <div style={{ height: 350, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
      </div>
     </div>}
    </div>
  )
}
