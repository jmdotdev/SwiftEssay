import {React, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import './OrderDetails.css'
export const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState();

  const getOrder = async ()=>{
    await axios.get(`http://localhost:5000/orders/getSingleOrder/${id}`).then(res=>{
      setOrder(res.data)
      console.log(res.data)
    })
  }
  useEffect(()=>{
     getOrder()
  },[])
  return (
    <div className='order-detail'>
      <h3>Order Details</h3>
      <table>
  <thead>
    <tr>
      <th className="fixed-column">Properties</th>
      <th className="fixed-column">Values</th>
    </tr>
  </thead>
  {order ?  <tbody>
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
    </div>
  )
}

