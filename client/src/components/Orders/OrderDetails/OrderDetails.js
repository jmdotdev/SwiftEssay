import {React, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import './OrderDetails.css'
import { isExpired, decodeToken } from "react-jwt";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import moment from "moment"
import { getUserById } from '../../../utils/getUserData';
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#FFFF",
  p: 4,
};
export const OrderDetails = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [order, setOrder] = useState();
  const [assignedTo, setAssignedTo] = useState();
  const [writersList, setWritersList] = useState([]);
  const [loggedInWriter,setLoggedInWriter] = useState();
  const [rate,setRate] = useState();
  const [comment,setComment] = useState();
  const myDecodedToken = decodeToken(localStorage.getItem('token'));
  const isMyTokenExpired = isExpired(localStorage.getItem('token'));



  const getWriters = async () => {
    await axios.get("http://localhost:5000/writers/getWriters").then((res) => {
      setWritersList(res.data);
    });
  };
  const getOrder = async ()=>{
    await axios.get(`http://localhost:5000/orders/getSingleOrder/${id}`).then(res=>{
      setOrder(res.data)
    })
  }

  const assignOrder = async() =>{
       const assignedWriter = writersList.find(writer => writer._id === assignedTo)
       console.log("assignedWriter",assignedWriter)
      await axios.patch(`http://localhost:5000/orders/assignOrder/${id}`,assignedWriter)
      .then(res=>console.log(res));
  }

  const claimOrder = async() =>{
   const writer = writersList.find(writer =>writer._id == loggedInWriter.userId);
   await axios.patch(`http://localhost:5000/orders/assignOrder/${id}`,writer)
   .then(res=>console.log(res));
}
  useEffect(()=>{
     setLoggedInWriter(myDecodedToken.payload)
     const fetchData = async () => {
     await getOrder();
     await getWriters(); 
    }
     fetchData();
  },[])
  const submitHandler = async (e) =>{
    e.preventDefault();
    assignOrder();
  }
  const rateWriterHandler = async (e) =>{
    e.preventDefault();
    const writer = writersList.find(writer =>writer._id == loggedInWriter.userId);
    await axios.post('http://localhost:5000/writers/rateWriter',{
      writer_id:writer._id,
      task_id:order._id,
      rating:rate,
      comment
    })
    .then(res=>console.log(res))
  }
  return (
    <div className='order-detail'>
      <h3>Order Details</h3>
      <form onSubmit={submitHandler} className='assign-form'>
        <div className='input-dropdown'>
        <label>Assigned To:</label>
        <select value={assignedTo} onChange={(e)=>setAssignedTo(e.target.value)}>
         {writersList.map(writer=> <option key={writer._id} value={writer._id}>{writer.email}</option>)}
        </select>
        </div>
        <button className='btn'>assign</button>
        </form>
      <table>
  <thead>
    <tr>
      <th className="fixed-column">Properties</th>
      <th className="fixed-column">Values</th>
    </tr>
  </thead>
  {order ?  <tbody>
    <tr>
      <td className="fixed-column">Assigned To</td>
      <td>{order.assigned_to ? order.assigned_to.email : <p style={{color:'red'}}>Not Assigned</p>}</td>
    </tr>
    <tr>
      <td className="fixed-column">Academic Level</td>
      <td>{order.academic_level}</td>
    </tr>
    <tr>
      <td className="fixed-column">Citations</td>
      <td>{order.citations}</td>
    </tr>
    <tr>
      <td className="fixed-column">Created On</td>
      <td>{moment(order.created_at).format('dddd, MMMM Do YYYY')}</td>
    </tr>
    <tr>
      <td className="fixed-column">Deadline</td>
      <td>{moment(order.deadline).format('dddd, MMMM Do YYYY')}</td>
    </tr>
    <tr>
      <td className="fixed-column">Discipline</td>
      <td>{order.discipline}</td>
    </tr>
    <tr>
      <td className="fixed-column">Files</td>
      <td>
      {order.files ? (
  <ul>
    {order.files.map((file, index) => (
      <li key={index}>
        <a href={`http://localhost:5000/${file.path}`} download>{file.originalname}</a>
      </li>
    ))}
  </ul>
) : null}

  </td>
    </tr>
    <tr>
      <td className="fixed-column">Instructions</td>
      <td>{order.instructions}</td>
    </tr>
    <tr>
      <td className="fixed-column">Page Format</td>
      <td>{order.page_format}</td>
    </tr>
    <tr>
      <td className="fixed-column">Pages</td>
      <td>{order.pages}</td>
    </tr>
    <tr>
      <td className="fixed-column">Amount Payable</td>
      <td>{order.amount_payable}</td>
    </tr>
    <tr>
      <td className="fixed-column">Posted By</td>
      <td>{order.posted_by?.email}</td>
    </tr>
    <tr>
      
      <td className="fixed-column">Slides</td>
      <td>{order.slides}</td>
    </tr>
    <tr>
      <td className="fixed-column">Submitted Files</td>
      <td>
    {order.submitted_files ? (
      <ul>
        {order.submitted_files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    ) : null}
  </td>
    </tr>
    <tr>
      <td className="fixed-column">Topic</td>
      <td>{order.topic}</td>
    </tr>
    <tr>
      <td className="fixed-column">Type</td>
      <td>{order.type}</td>
    </tr>
    <tr>
      <td className="fixed-column">Updated At</td>
      <td>{order.updated_at}</td>
    </tr>
  </tbody>:"loading order..."}
</table>
 {/* Modal to add writer */}
 <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3 style={{ marginBottom: "20px" }}>Rate the Work:</h3>
          <form onSubmit={rateWriterHandler}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <label>rating:(rating should be from 0-5 with 5 being the highest)</label>
              <input
                type="number"
                placeholder="rating"
                value={rate}
                onChange={(e)=>{setRate(e.target.value)}}
              />
            </Typography>
            <label>comment</label>
            <textarea placeholder='Add Comment' value={comment} onChange={(e)=>{setComment(e.target.value)}}/>
            <button className="add-writer-btn">Add Rating</button>
          </form>
        </Box>
      </Modal>
      {/* End of modal to add user */}
 <button className='btn' onClick={claimOrder}>Claim Order</button>
 <button className='btn' onClick={handleOpen}>Rate Order</button>
    </div>
  )
}

