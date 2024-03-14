import { React, useEffect, useState } from "react";
import "./Messages.css";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import smsIcon from "../../assets/images/sms.svg";
import emailIcon from "../../assets/images/email.svg";
import messagesIcon from "../../assets/images/message.svg";
import { DataGrid } from "@mui/x-data-grid";
import {TopNav}  from '../topnav/TopNav'
import { Link } from "react-router-dom";
import axios from 'axios'
export const Messages = () => {
  const [tabvalue, setTabValue] = useState(0);
  const [messages,setMessages] = useState([]);
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "client", headerName: "Client", width: 130 },
    { field: "writer", headerName: "Writer", width: 130 },
    { field: "message", headerName: "Message", width: 130 },
    { field: "sent_on", headerName: "Sent_On", width: 130 },
    { field: "is_read", headerName: "Is_Read", width: 130 },
  ];

  const rows =messages.map((m,i)=>(
    {
      id:i+1,
      client:m.from,
      writer:m.sent_to,
      message:m.message,
      sent_on:m.sent_on,
      is_read:m.is_read ? 1: 0
    }
  ))


  const getInAppMessages = async() =>{
    await axios.get('http://localhost:5000/messages/getMessages').then(
      (res)=>{
        setMessages(res.data.payload)
      }
    )
  }

  useEffect(() =>{
    getInAppMessages()
  },[])
  return (
    <div className="messages-content">
      <TopNav/>
      <div className="messages-content-title">
        <h3>Communication Dashboard</h3>
      </div>
      <div className="messages-content-cards">
        <div className="messages-card">
          <Link to="/sendmessage">
          <div className="left-section">
            <h2>Onsite</h2>
            <h4>messages</h4>
          </div>
          </Link>
          <div className="right-section">
            <img src={messagesIcon} alt="messages.svg" />
          </div>
        </div>
        <div className="messages-card">
          <div className="left-section">
            <h2>SMS</h2>
            <h4>client/writers</h4>
          </div>
          <div className="right-section">
            <img src={smsIcon} alt="orders-image.png" />
          </div>
        </div>{" "}
        <div className="messages-card">
          <div className="left-section">
            <h2>Email</h2>
            <h4>client/writers</h4>
          </div>
          <div className="right-section">
            <img src={emailIcon} alt="orders-image.png" />
          </div>
        </div>
      </div>
      <div className="tabs">
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Tabs value={tabvalue} onChange={handleChange} centered>
            <Tab label="Messages" />
            <Tab label="Emails" />
          </Tabs>
        </Box>
        <div className="tabs-info">
          {tabvalue == 0 && (
            <div style={{ height: 300, width: "100%" }}>
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
          )}
          {tabvalue == 1 && (
            <div style={{ height: 300, width: "100%" }}>
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
          )}
        </div>
      </div>
    </div>
  );
};
