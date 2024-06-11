import {React,useEffect,useState} from 'react'
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
import { useJwt } from "react-jwt";
import axios from 'axios'
import { Link,useNavigate } from 'react-router-dom';
import {verifyToken} from '../../utils/verifyToken';
import { AiOutlineSend } from "react-icons/ai";
import { OrderCard } from '../../shared/OrderCard';

export const Dashboard = () => {
    const [tabvalue, setTabValue] = useState(0);
    const [loggedInUser,setLoggedInUser] = useState(null)
    const [isLoggedIn,setIsLoggedIn] = useState(false)
    const navigate = useNavigate();
    const [latestOrders,setLatestOrders] = useState([])
    const latestOrderColumns = [
      { field: "id", headerName: "ID", width: 150 },
      { field: "sn", headerName: "SN", width: 150 },
      { field: "level", headerName: "Level", width: 150 },
      { field: "discipline", headerName: "Discipline", width: 150 },
      { field: "topic", headerName: "Topic", width: 150 },
      { field: "type", headerName: "Type", width: 150 },
      { field: "deadline", headerName: "Deadline", width: 150 },
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params) => (
          <Link to={`/orders/order-details/${params.row.id}`}>
            <div className="order-detail-icon">
              <AiOutlineSend />
            </div>
          </Link>
        ),
      },
    ];
    const latestOrderRow = latestOrders.filter(order => order.status == 'available')
    .map((order,index)=>(
      {
        id: order._id,
        sn:index + 1,
        level: order.academic_level,
        discipline: order.discipline,
        topic: order.topic,
        type: order.type,
        single_double: order.single_or_double,
        files: order.files,
        deadline: order.deadline,
      }
    ))

    const getOrders = async () =>{
      await axios.get("http://localhost:5000/orders/getOrders").then((res) => {
        setLatestOrders(res.data)
      });
    }

  useEffect(() => {
    const fetchData = async () => {
      await verifyToken(setLoggedInUser, setIsLoggedIn, navigate);
      await getOrders();
    };

    fetchData();
  }, [isLoggedIn]);
  return (
    <div className='dashboard-content'>
      <TopNav/>
        <div className='dashboard-content-title'>
            <h3>Dashboard</h3>
        </div>
        <div className='dashboard-content-cards'>
          <OrderCard orderCount={(latestOrders.filter(ord=>ord.status === 'available')).length} orderType='Available' Icon={pendingIcon}/>
          <OrderCard orderCount={(latestOrders.filter(ord=>ord.status === 'revision')).length} orderType='Revision' Icon={repeatIcon}/>
          <OrderCard orderCount={(latestOrders.filter(ord=>ord.status === 'progress')).length} orderType='In Progress' Icon={progressIcon}/>
          <OrderCard orderCount={(latestOrders.filter(ord=>ord.status === 'completed')).length} orderType='Completed' Icon={completedIcon}/>
        </div>
        <div className='tabs'>
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs centered>
        <Tab label="Latest Rated Orders" />
      </Tabs>
    </Box>
    <div className='tabs-info'>
        <div style={{ height: 350, width: "100%", padding:"10px" }}>
          <DataGrid
            columnVisibilityModel={{
              id: false,
            }}
            rows={latestOrderRow}
            columns={latestOrderColumns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
    </div>
        </div>
    </div>
  )
}
