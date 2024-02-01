import {React,useState} from 'react'
import './Dashboard.css'
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import pendingIcon from '../../assets/images/pending.svg'
import progressIcon from '../../assets/images/progress.jpg'
import completedIcon from '../../assets/images/complete.jpg'
import repeatIcon from '../../assets/images/repeat.svg'
import { DataGrid } from "@mui/x-data-grid";
import {TopNav} from '../topnav/TopNav'
export const Dashboard = () => {

    const [tabvalue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
      setTabValue(newValue);
    };
    const columns = [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'client', headerName: 'Client', width: 130 },
      { field: 'writer', headerName: 'Writer', width: 130 },
      { field: 'comment', headerName: 'Comment', width: 130 },
    ];
    
    const rows = [
      { id: 1, writer: 'Snow', client: 'Jon', comment: 35 },
      { id: 2, writer: 'Lannister', client: 'Cersei', comment: 42 },
      { id: 3, writer: 'Lannister', client: 'Jaime', comment: 45 },
      { id: 4, writer: 'Stark', client: 'Arya', comment: 16 },
      { id: 5, writer: 'Targaryen', client: 'Daenerys', comment: null },
      { id: 6, writer: 'Melisandre', client: null, comment: 150 },
      { id: 7, writer: 'Clifford', client: 'Ferrara', comment: 44 },
      { id: 8, writer: 'Frances', client: 'Rossini', comment: 36 },
      { id: 9, writer: 'Roxie', client: 'Harvey', comment: 65 },
    ];
  return (
    <div className='dashboard-content'>
      <TopNav />
        <div className='dashboard-content-title'>
            <h3>Dashboard</h3>
        </div>
        <div className='dashboard-content-cards'>
            <div className='dashboard-card'>
                <div className='left-section'>
                   <h2>26</h2>
                   <h4>Pending Orders</h4>
                </div>
                <div className='right-section'>
                   <img src={pendingIcon} alt='orders-image.png'/>
                </div>
            </div>
            <div className='dashboard-card'>
                <div className='left-section'>
                   <h2>18</h2>
                   <h4>Orders Inprogress</h4>
                </div>
                <div className='right-section'>
                   <img src={progressIcon} alt='orders-image.png'/>
                </div>
            </div> <div className='dashboard-card'>
                <div className='left-section'>
                   <h2>10</h2>
                   <h4>Completed Orders</h4>
                </div>
                <div className='right-section'>
                   <img src={completedIcon} alt='orders-image.png'/>
                </div>
            </div> <div className='dashboard-card'>
                <div className='left-section'>
                   <h2>5</h2>
                   <h4>Revision Orders</h4>
                </div>
                <div className='right-section'>
                   <img src={repeatIcon} alt='orders-image.png'/>
                </div>
            </div>
        </div>
        <div className='tabs'>
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={tabvalue} onChange={handleChange} centered>
        <Tab label="Approval Comments" />
        <Tab label="Revision Requests" />
        <Tab label="Order Disputes" />
      </Tabs>
    </Box>
    <div className='tabs-info'>
      {tabvalue == 0 && <div style={{ height: 350, width: "100%", padding:"10px" }}>
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
        </div>}
      {tabvalue == 1 && <div style={{ height: 300, width: "100%" }}>
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
        </div>}
      {tabvalue == 2 && <div style={{ height: 300, width: "100%" }}>
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
        </div>}
      
    </div>
        </div>
    </div>
  )
}
