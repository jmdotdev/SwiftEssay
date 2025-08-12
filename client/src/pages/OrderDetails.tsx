import {React, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { isExpired, decodeToken } from "react-jwt";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import moment from "moment"
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
      console.log('writers', res)
      setWritersList(res.data);
    });
  };
  const getOrder = async ()=>{
    await axios.get(`http://localhost:5000/orders/getSingleOrder/${id}`).then(res=>{
      console.log('res',res)
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
     //setLoggedInWriter(myDecodedToken.payload)
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
    <div className='flex flex-col h-full w-full p-8 overflow-y-auto'>
      <h3>Order Details</h3>
      <form onSubmit={submitHandler} className='flex items-center w-full mb-5 mt-3'>
        <div className='w-full'>
        <label>Assigned To:</label>
        <select value={assignedTo} onChange={(e)=>setAssignedTo(e.target.value)}>
         {writersList.map(writer=> <option key={writer._id} value={writer._id}>{writer.email}</option>)}
        </select>
        </div>
        <button className='bg-darkBlue text-white px-4 py-2 border-0 outline-0 w-40 rounded-md cursor-pointer'>assign</button>
        </form>
      <table className='w-full border-collapse'>
  <thead>
    <tr className='h-12'>
      <th className="sticky left-0 p-3 border-[1px] border-gray-300 bg-gray-200">Properties</th>
      <th className="sticky left-0 bg-gray-200 border-[1px] border-gray-300">Values</th>
    </tr>
  </thead>
  {order ?  <tbody>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Assigned To</td>
      <td className='sticky left-0 bg-gray-100 border-[1px] border-gray-300 p-3'>{order.assigned_to ? order.assigned_to.email : <p style={{color:'red'}}>Not Assigned</p>}</td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Academic Level</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{order.academic_level}</td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Citations</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{order.citations}</td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Created On</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{moment(order.created_at).format('dddd, MMMM Do YYYY')}</td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Deadline</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{moment(order.deadline).format('dddd, MMMM Do YYYY')}</td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Discipline</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{order.discipline}</td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Files</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>
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
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Instructions</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{order.instructions}</td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Order ID</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{order.order_id}</td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Page Format</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{order.page_format}</td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Pages</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{order.pages}</td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Amount Payable</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{order.amount_payable}</td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Posted By</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{order.posted_by?.email}</td>
    </tr>
    <tr className='h-12'>
      
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Slides</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{order.slides}</td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Submitted Files</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>
    {order.submitted_files ? (
      <ul>
        {order.submitted_files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    ) : null}
  </td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Topic</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{order.topic}</td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Type</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{order.type}</td>
    </tr>
    <tr className='h-12'>
      <td className="sticky left-0 bg-gray-200 border-[1px] border-gray-300 p-3">Updated At</td>
      <td className='bg-gray-100 border-[1px] border-gray-300 p-3'>{order.updated_at}</td>
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
            <button className="bg-darkBlue text-white p-4 border-0 outline-0 w-auto rounded-md cursor-pointer">Add Rating</button>
          </form>
        </Box>
      </Modal>
      {/* End of modal to add user */}
 <button className='bg-darkBlue text-white px-4 py-2 border-0 my-2 outline-0 w-40 rounded-md cursor-pointer' onClick={claimOrder}>Claim Order</button>
 <button className='bg-darkBlue text-white px-4 py-2 border-0 outline-0 w-40 rounded-md cursor-pointer' onClick={handleOpen}>Rate Order</button>
    </div>
  )
}

