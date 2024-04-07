import React, { useEffect, useState } from "react";
import "./Writers.css";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TopNav } from "../topnav/TopNav";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#FFFF",
  p: 4,
};
export const Writers = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();
  const [writersList, setWritersList] = useState([]);
  const [newWriterAdded,setNewWriterAdded] = useState(false);
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
        <MenuItem>Edit</MenuItem>
        <MenuItem onClick={()=>deleteWriter(row)}>Delete</MenuItem>
      </Menu>
    </div>
  );
 
  
  const deleteWriter = async (row) =>{
    console.log(row)
      await axios.delete(`http://localhost:5000/writers/deleteWriter/${row.id}`)
      .then(res=>{
        console.log(res)
      })
  }
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const fetchWriters = async () => {
    await axios.get("http://localhost:5000/writers/getWriters").then((res) => {
      setWritersList(res.data);
      console.log("writers", writersList);
    });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:5000/writers/registerWriter", {
        username,
        email,
        phone,
        password,
      })
      .then((res) => {
        console.log(res);
        setNewWriterAdded(!newWriterAdded)
      });
  };

  useEffect(() => {
    fetchWriters();
  }, [newWriterAdded]);
  const columns = [
    { field: "sn", headerName: "SN", width: 150 },
    { field: "id", headerName: "ID", width: 150},
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "tasks_done",
      headerName: "Tasks_Done",
      type: "number",
      width: 150,
    },
    { field: "assigned", headerName: "Assigned", type: "boolean", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: CustomActionCell,
    },
  ];
  const rows = writersList
    .filter((writer) => writer.role == "writer")
    .map((writer, index) => ({
      sn:index,
      id: writer._id,
      username: writer.username,
      email: writer.email,
      phone: writer.phone,
      tasks_done: writer.assigned_tasks.length,
      assigned: writer.is_assigned ? 1 : 0
    }));
  return (
    <div className="writers-section">
      <TopNav />
      {/* Modal to add writer */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3 style={{ marginBottom: "20px" }}>Add New Writer:</h3>
          <form onSubmit={submitHandler}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <label>Username:</label>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <label>Email:</label>
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <label>Phone:</label>
              <input
                type="text"
                placeholder="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <label>Password</label>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Typography>
            <button className="add-writer-btn">Add Writer</button>
          </form>
        </Box>
      </Modal>
      {/* End of modal to add user */}
      <div className="writers-header">
        <h4>Writers</h4>
        <button className="add-writer-btn" onClick={handleOpen}>
          Add Writer
        </button>
      </div>
      <div className="writers-filters">
        <a>
          Assigned<span>0</span>
        </a>
        <a>Unassigned</a>
        <a>Active</a>
        <a>Inactive</a>
        <form>
          <input type="text" placeholder="search" />
        </form>
      </div>
      <div className="writers-list">
        <div style={{ height: 350, width: "100%" }}>
          <DataGrid
            columnVisibilityModel={{
              id:false
            }}
            rowSelection= {false}
            rows={rows}
            columns={columns}
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
  );
};
