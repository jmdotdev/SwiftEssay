import React, { useEffect, useState } from "react";
import "./Orders.css";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import { TopNav } from "../topnav/TopNav";
import axios from "axios";
export const Orders = ({ isAuth }) => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const columns = [
    { field: "id", headerName: "ID", width: 150 },
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
          <button className="edit-order-btn">View Order</button>
        </Link>
      ),
    },
  ];
  const rows = orders.map((order, index) => ({
    id: order._id,
    level: order.academic_level,
    discipline: order.discipline,
    topic: order.topic,
    type: order.type,
    single_double: order.single_or_double,
    files: order.files,
    deadline: order.deadline,
  }));
  const getOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        redirectToLogin();
      }
      setLoading(true);
      await axios
        .get("http://localhost:5000/orders/getOrders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setOrders(res.data);
        });
    } catch (error) {
      console.log(error);
    } finally {
      // Set loading to false whether the request is successful or not
      setLoading(false);
    }
  };

  const redirectToLogin = () => {
    navigate("/login");
  };
  useEffect(() => {
    getOrders();
  }, [isAuth]);

  return isAuth ? (
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
            <a>
              Available<span>0</span>
            </a>
            <a>Assigned</a>
            <a>Pending</a>
            <a>Completed</a>
            <a>Revision</a>
            <a>Progress</a>
            <a>Cancelled</a>
            <a>Approved</a>
          </div>
          <div className="orders-list">
            <div style={{ height: 350, width: "100%" }}>
              {loading ? (
                <Box sx={{ display: "flex",alignItems:"center",justifyContent:"center",height:"100%" }}>
                  <CircularProgress />
                </Box>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      }
    </div>
  ) : (
    redirectToLogin()
  );
};
