import { React, useState } from "react";
import "./Messages.css";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import smsIcon from "../../assets/images/sms.svg";
import emailIcon from "../../assets/images/email.svg";
import messagesIcon from "../../assets/images/message.svg";
import { DataGrid } from "@mui/x-data-grid";
import {TopNav}  from '../topnav/TopNav'
export const Messages = () => {
  const [tabvalue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "client", headerName: "Client", width: 130 },
    { field: "writer", headerName: "Writer", width: 130 },
    { field: "comment", headerName: "Comment", width: 130 },
  ];

  const rows = [
    { id: 1, writer: "Snow", client: "Jon", comment: 35 },
    { id: 2, writer: "Lannister", client: "Cersei", comment: 42 },
    { id: 3, writer: "Lannister", client: "Jaime", comment: 45 },
    { id: 4, writer: "Stark", client: "Arya", comment: 16 },
    { id: 5, writer: "Targaryen", client: "Daenerys", comment: null },
    { id: 6, writer: "Melisandre", client: null, comment: 150 },
    { id: 7, writer: "Clifford", client: "Ferrara", comment: 44 },
    { id: 8, writer: "Frances", client: "Rossini", comment: 36 },
    { id: 9, writer: "Roxie", client: "Harvey", comment: 65 },
  ];
  return (
    <div className="messages-content">
      <TopNav/>
      <div className="messages-content-title">
        <h3>Communication Dashboard</h3>
      </div>
      <div className="messages-content-cards">
        <div className="messages-card">
          <div className="left-section">
            <h2>Onsite</h2>
            <h4>messages</h4>
          </div>
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
            <Tab label="Approval Comments" />
            <Tab label="Revision Requests" />
            <Tab label="Order Disputes" />
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
          {tabvalue == 2 && (
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
