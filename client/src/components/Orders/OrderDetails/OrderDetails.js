import {React, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import './OrderDetails.css'
import { isExpired, decodeToken } from "react-jwt";
export const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState();
  const [assignedTo, setAssignedTo] = useState();
  const [writersList, setWritersList] = useState([]);
  const [loggedInWriter,setLoggedInWriter] = useState();
  
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
     getOrder();
     getWriters();
  },[])
  const submitHandler = async (e) =>{
    e.preventDefault();
    assignOrder();
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
      <td>{order.assigned_to?.email}</td>
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
      <td>{order.created_at}</td>
    </tr>
    <tr>
      <td className="fixed-column">Deadline</td>
      <td>{order.deadline}</td>
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
          <li key={index}>{file.name}</li>
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
      <td>Display Color Value</td>
    </tr>
    <tr>
      <td className="fixed-column">Slides</td>
      <td>{order.pages}</td>
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
 <button className='btn' onClick={claimOrder}>Claim Order</button>
    </div>
  )
}

