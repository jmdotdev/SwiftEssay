import {React,useState} from 'react'
import './DashboardContent.css'
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import pendingIcon from '../../assets/images/pending.svg'
import progressIcon from '../../assets/images/progress.jpg'
import completedIcon from '../../assets/images/complete.jpg'
import repeatIcon from '../../assets/images/repeat.svg'
export const DashboardContent = () => {

    const [tabvalue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
      setTabValue(newValue);
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
                   <img src={pendingIcon} alt='orders-image.png'/>
                </div>
            </div>
            <div className='dashboard-card'>
                <div className='left-section'>
                   <h2>26</h2>
                   <h4>Orders Inprogress</h4>
                </div>
                <div className='right-section'>
                   <img src={progressIcon} alt='orders-image.png'/>
                </div>
            </div> <div className='dashboard-card'>
                <div className='left-section'>
                   <h2>26</h2>
                   <h4>Completed Orders</h4>
                </div>
                <div className='right-section'>
                   <img src={completedIcon} alt='orders-image.png'/>
                </div>
            </div> <div className='dashboard-card'>
                <div className='left-section'>
                   <h2>26</h2>
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
      {tabvalue == 0 && <p>Tab one</p>}
      {tabvalue == 1 && <p>Tab two</p>}
      {tabvalue == 2 && <p>Tab three</p>}
      
    </div>
        </div>
    </div>
  )
}
