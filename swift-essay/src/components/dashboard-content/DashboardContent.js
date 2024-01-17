import {React,useState} from 'react'
import './DashboardContent.css'
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { HiOutlineShoppingBag } from "react-icons/hi2";
export const DashboardContent = () => {

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  return (
    <div className='dashboard-content'>
        <div className='dashboard-content-title'>
            <h4>Dashboard</h4>
        </div>
        <div className='dashboard-content-cards'>
            <div className='dashboard-card'>
                <div className='left-section'>
                   <h2>26</h2>
                   <h4>Pending Orders</h4>
                </div>
                <div className='right-section'>
                   <HiOutlineShoppingBag/>
                </div>
            </div>
            <div className='dashboard-card'>
                <div className='left-section'>
                   <h2>26</h2>
                   <h4>Pending Orders</h4>
                </div>
                <div className='right-section'>
                   <HiOutlineShoppingBag/>
                </div>
            </div>
            <div className='dashboard-card'>
                <div className='left-section'>
                   <h2>26</h2>
                   <h4>Pending Orders</h4>
                </div>
                <div className='right-section'>
                   <HiOutlineShoppingBag/>
                </div>
            </div>
            <div className='dashboard-card'>
                <div className='left-section'>
                   <h2>26</h2>
                   <h4>Pending Orders</h4>
                </div>
                <div className='right-section'>
                   <HiOutlineShoppingBag/>
                </div>
            </div>
        </div>
        <div className='tabs'>
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Item One" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
      </Tabs>
    </Box>
        </div>
    </div>
  )
}
