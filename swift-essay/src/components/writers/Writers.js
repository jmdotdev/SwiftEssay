import React,{useState} from 'react'
import './Writers.css'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#FFFF',
  p: 4,
};
export const Writers = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
      {/* Modal to add writer */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3 style={{marginBottom:'20px'}}>Add New Writer:</h3>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <label>Username:</label>
           <input type='text' placeholder='username' />
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <label>Email:</label>
           <input type='email' placeholder='email' />
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <label>Phone:</label>
           <input type='text' placeholder='phone' />
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <label>City</label>
           <input type='text' placeholder='city' />
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <label>Password</label>
           <input type='password' placeholder='password' />
          </Typography>
          <button className='add-writer-btn'>Add Writer</button>
        </Box>
      </Modal>
      {/* End of modal to add user */}
      <div className='writers-header'>
        <h4>Writers</h4>
        <button className='add-writer-btn' onClick={handleOpen}>Add Writer</button>
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

