import React, { useEffect, useState } from "react";
import "./Orders.css";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import { TopNav } from "../topnav/TopNav";
import axios from "axios";
export const Orders = ({ isAuth }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders,setFilteredOrders] = useState([])
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const CustomActionCell = ({ row }) => (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="action-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem><Link to={`/orders/order-details/${row.id}`}>View</Link></MenuItem>
        <MenuItem><Link to={`/orders/add-order/${row.id}`}>Edit</Link></MenuItem>
        <MenuItem onClick={()=>{deleteOrder(row.id)}}>Delete</MenuItem>
      </Menu>
    </div>
  );
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const getOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      await axios
        .get("http://localhost:5000/orders/getOrders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setOrders(res.data)
        });
    } catch (error) {
      console.log(error);
    } finally {
      // Set loading to false whether the request is successful or not
      setLoading(false);
    }
  };
   
  const deleteOrder = async (id) =>{
    try{
        console.log("id",id)
       await axios.delete(`http://localhost:5000/orders/deleteOrder/${id}`)
       .then(res=>{
        console.log(res);
       })
    }
    catch(error){
      console.log(error)
    }
  }


  const filterOrder = (filter) => {
    const filterOrders = filteredOrders.filter(
      (order) => order.status === filter
    );
    setOrders(filterOrders)
  };
  useEffect(() => {
    getOrders();
  }, [isAuth]);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "sn", headerName: "SN", width: 150 },
    { field: "level", headerName: "Level", width: 150 },
    { field: "discipline", headerName: "Discipline", width: 150 },
    { field: "topic", headerName: "Topic", width: 150 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "deadline", headerName: "Deadline", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: CustomActionCell,
    },
  ];
  const rows = orders.map((order, index) => ({
    id: order._id,
    sn:index + 1,
    level: order.academic_level,
    discipline: order.discipline,
    topic: order.topic,
    type: order.type,
    single_double: order.single_or_double,
    files: order.files,
    deadline: order.deadline,
  }));

  return (
    <div className="orders-section">
      <TopNav />
      {
        <div>
          <div className="orders-header">
            <h4>Orders</h4>
            <Link className="link" to="add-order">
              <button className="add-order-btn">Add Order</button>
            </Link>
          </div>
          <div className="order-filters">
            <a onClick={() => filterOrder("available")}>
              Available<span>0</span>
            </a>
            <a onClick={() => filterOrder("assigned")}>Assigned</a>
            <a onClick={() => filterOrder("Pending")}>Pending</a>
            <a onClick={() => filterOrder("Completed")}>Completed</a>
            <a onClick={() => filterOrder("Revision")}>Revision</a>
            <a onClick={() => filterOrder("Progress")}>Progress</a>
            <a onClick={() => filterOrder("Cancelled")}>Cancelled</a>
          </div>
          <div className="orders-list">
            <div style={{ height: 350, width: "100%" }}>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <DataGrid
                  columnVisibilityModel={{
                    id:false,
                  }}
                  rowSelection = {false}
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                />
              )}
            </div>
          </div>
        </div>
      }
    </div>
  ) 
};
