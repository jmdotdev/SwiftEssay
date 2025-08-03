import {useEffect,useState} from 'react'
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { DataGrid } from "@mui/x-data-grid";
import { useJwt } from "react-jwt";
import axios from 'axios'
import { Link,useNavigate } from 'react-router-dom';
import {verifyToken} from '../utils/verifyToken';
import { SendHorizontal } from 'lucide-react';
import { OrderCard } from '../components/OrderCard';

export const Dashboard = () => {
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
              <SendHorizontal  className='h-4 w-4'/>
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
      // await verifyToken(setLoggedInUser, setIsLoggedIn, navigate);
      await getOrders();
    };

    fetchData();
  }, []);
  return (
    <div className='flex flex-col w-full h-[calc(100vh-100px)] px-5 py-0'>
        <div className='flex w-full items-start'>
          <h4 className="text-darkBlue font-semibold text-xl">Dashboard</h4>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 justify-between h-auto w-full my-6'>
          <OrderCard orderCount={(latestOrders.filter(ord=>ord.status === 'available')).length} orderType='Available' Icon='/images/pending.svg'/>
          <OrderCard orderCount={(latestOrders.filter(ord=>ord.status === 'revision')).length} orderType='Revision' Icon='/images/repeat.svg'/>
          <OrderCard orderCount={(latestOrders.filter(ord=>ord.status === 'progress')).length} orderType='In Progress' Icon='/images/progress.jpg'/>
          <OrderCard orderCount={(latestOrders.filter(ord=>ord.status === 'canceled')).length} orderType='Canceled' Icon='/images/cancel.png'/>
          <OrderCard orderCount={(latestOrders.filter(ord=>ord.status === 'completed')).length} orderType='Completed' Icon='/images/complete.jpg'/>
        </div>
        <div className='flex flex-col h-auto w-full bg-white'>
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs centered>
        <Tab label="Latest Orders" />
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
