import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import axios from "axios";
import { toast } from 'react-toastify';
import { AddWriterModal } from "@/components/AddWriterModal";

export const Writers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
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
        <MenuItem><Link to={`/profile/${row.id}`}>View</Link></MenuItem>
        <MenuItem onClick={()=>deleteWriter(row)}>Delete</MenuItem>
      </Menu>
    </div>
  );
 
  
  const deleteWriter = async (row) =>{
    console.log(row)
      await axios.delete(`http://localhost:5000/writers/deleteWriter/${row.id}`)
      .then(async res=>{
        await fetchWriters();
        toast.success("writer deleted successfully")
      }).catch(error=>{
        toast.error(error.message)
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
    }).catch(error=>{
      toast.error("error fetching writers")
    })
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
      headerName: "Tasks Done",
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
      sn: index + 1,
      id: writer._id,
      username: writer.username,
      email: writer.email,
      phone: writer.phone,
      tasks_done: writer.assigned_tasks.length,
      assigned: writer.is_assigned ? 1 : 0
    }));
  return (
    <div className="flex flex-col w-full h-[calc(100vh-100px)] px-5 py-0">
      <div className="flex items-center justify-between my-5 mx-0 text-xl font-semibold">
        <h4 className="text-darkBlue font-semibold text-xl">Writers</h4>
        <button className="bg-darkBlue text-white text-sm px-4 py-2 rounded-lg cursor-pointer" onClick={handleOpen}>
          Add Writer
        </button>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between bg-white w-full h-auto md:h-12 cursor-pointer px-2 py-7 rounded-lg">
        <a className="my-5 mx-0 relative">
          Assigned<span className="absolute bottom-2 ms-[0.5px] text-sm text-red-600">0</span>
        </a>
        <a className="my-5 mx-0">Unassigned</a>
        <a className="my-5 mx-0">Active</a>
        <a className="my-5 mx-0">Inactive</a>
        <form className="mb-6 md:mb-0">
          <input className="h-6 p-4 border-[1px] border-gray-600 rounded-lg focus: outline-0" type="text" placeholder="search" />
        </form>
      </div>
      <div className="my-4 h-full w-full p-6 bg-white rounded-lg">
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
      {
        setIsOpen && <AddWriterModal isOpen={isOpen} handleClose={handleClose} tiggerGetWriters={fetchWriters}/>
      }
    </div>
  );
};
