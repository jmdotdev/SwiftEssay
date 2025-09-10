import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import axios from "axios";
import { toast } from 'react-toastify';
import { AddWriterModal } from "@/components/AddWriterModal";
import { WritersTable } from "@/components/WritersTable";
import { Writer } from "@/types/Writer";

export const Writers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const [writersList, setWritersList] = useState<Writer[]>([]);
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
        {
          writersList.length && <WritersTable writers={writersList} />
        }
      </div>
      {
        setIsOpen && <AddWriterModal isOpen={isOpen} handleClose={handleClose} tiggerGetWriters={fetchWriters}/>
      }
    </div>
  );
};
