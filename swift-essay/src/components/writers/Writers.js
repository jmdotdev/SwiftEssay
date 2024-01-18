import React from 'react'
import './Writers.css'
import { DataGrid } from '@mui/x-data-grid';
export const Writers = () => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'topic', headerName: 'Topic', width: 150 },
    { field: 'due', headerName: 'Due', width: 150 },
    {field: 'status',headerName: 'Status',type: 'number',width: 150},
    {field: 'client',headerName: 'Client',width: 150},
    {field: 'amount',headerName: 'Amount',type: 'number',width: 150},
  ];
  const rows = [
    { id: 1, due: 'Snow', topic: 'Jon', status: 35 ,client:'jayson',amount:50},
    { id: 2, due: 'Lannister', topic: 'Cersei', status: 42, client:'jayson',amount:50},
    { id: 3, due: 'Lannister', topic: 'Jaime', status: 45 ,client:'jayson',amount:50},
    { id: 4, due: 'Stark', topic: 'Arya', status: 16,client:'jay',amount:50 },
    { id: 5, due: 'Targaryen', topic: 'Daenerys', status: null,client:'Son' ,amount:50},
    { id: 6, due: 'Melisandre', topic: null, status: 150,client:'jays',amount:50 },
    { id: 7, due: 'Clifford', topic: 'Ferrara', status: 44,client:'john' ,amount:50},
    { id: 8, due: 'Frances', topic: 'Rossini', status: 36 ,client:'jayson',amount:50},
    { id: 9, due: 'Roxie', topic: 'Harvey', status: 65 ,client:'jay',amount:50},
  ];
  return (
    <div className='writers-section'>
      <div className='writers-header'>
        <h4>Writers</h4>
      </div>
      <div className='writers-filters'>
        <a>Available<span>0</span></a>
        <a>Assigned</a>
        <a>Pending</a>
        <a>Completed</a>
        <a>Revision</a>
        <a>Progress</a>
        <a>Cancelled</a>
        <a>Approved</a>
      </div>
      <div className='writers-list'>
      <div style={{ height: 400, width: '100%' }}>
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
    </div>
  )
}

