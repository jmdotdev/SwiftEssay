import {React,useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import { TopNav } from "../../../components/topnav/TopNav";
import "./AddOrder.css";
import {orderDiscipline,paperTypes,citationOptions,academicLevels} from './AddOrderFormOptions'
import paypalImage from '../../../../src/assets/images/paypal.png'
import {getUserData} from '../../../utils/getUserData'
import axios from 'axios'
export const AddOrder = () => {
  const params = useParams()
  const [userId,setUserId] = useState()
  const [pages,setPages] = useState();
  const [isUpdate,setIsUpdate] = useState(false);
  const [userpayload, setUserPayload] = useState(null)
  const [orderDetails, setOrderDetails] = useState({
    academic_level: "",
    type: "",
    discipline: "",
    topic: "",
    instructions: "",
    files: [],
    page_format: "",
    pages: 0,
    amount_payable: "",
    citations: 0,
    slides: 0,
    // posted_by:userData.id,
    deadline: "",
  });
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setOrderDetails({ ...orderDetails, files });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    name === 'pages' && setPages(value)
    console.log(name,value)
    setOrderDetails({ ...orderDetails, [name]: +value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(orderDetails).forEach(([key, value]) => {
        if (key === "files") {
          value.forEach((file, index) => {
            formData.append("files", file);
          });
        } else {
          formData.append(key, value);
        }
      });
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      await axios.post("http://localhost:5000/orders/createOrder",formData)
      .then(res=>{
        window.location.href = res.data?.redirectionLink
        console.log('redirecting...')
      })

      console.log("Order submitted successfully!");
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const updateOrder = async (e) =>{
    e.preventDefault();
    await axios.put(`http://localhost:5000/orders/updateOrder/${params.id}`,orderDetails)
    .then(res => console.log(res))
  }

  const getOrderById = async () => {
     await axios.get(`http://localhost:5000/orders/getSingleOrder/${params.id}`)
     .then(res=>
      setOrderDetails(res.data)
     )
  }

  useEffect(()=>{
    setUserPayload(getUserData())
     // eslint-disable-next-line no-unused-expressions
     params.id ? (async()=>{
      await getOrderById();
    }) (): '';
  },[])
  return (
    <div className="main-container">
      <TopNav />
      <div className="add-order-container">
        <div className="add-order-form">
          <div className="header">
            <h2>{params.id ? 'Edit an Order' : 'Place an Order'} </h2>
            <p>Fast,Secure and Reliable</p>
          </div>
          <div className="order-form">
            <form onSubmit={params.id ? updateOrder : handleSubmit}>
              <div className="input-control">
                <label>Academic Level:</label>
                <select onChange={handleInputChange} value={orderDetails.academic_level} name="academic_level">
                  {academicLevels.map(al =><option>{al}</option> )}
                </select>
              </div>
              <div className="input-control">
                <label>Type:</label>
                <select onChange={handleInputChange} value={orderDetails.type} name="type">
                  {paperTypes.map(type =><option>{type}</option> )}
                </select>
              </div>
              <div className="input-control">
                <label>Discipline:</label>
                <select onChange={handleInputChange} value={orderDetails.discipline} name="discipline">
                  {orderDiscipline.map(discipline =><option>{discipline}</option> )}
                </select>
              </div>
              <div className="input-control">
                <label>Topic:</label>
                <input type="text" placeholder="topic" onChange={handleInputChange} value={orderDetails.topic} name="topic"/>
              </div>
              <div className="input-control">
                <label>Instructions:</label>
                <textarea type="text" placeholder="paper instructions" onChange={handleInputChange} value={orderDetails.instructions} name="instructions"/>
              </div>
              <div className="input-control">
                <label>Files:</label>
                <input type="file" multiple onChange={handleFileChange} name="files"/>
              </div>
              <div className="input-control">
                <label>Page Format</label>
                <select onChange={handleInputChange} value={orderDetails.page_format} name="page_format">
                  {citationOptions.map(option =><option>{option}</option> )}
                </select>
              </div>
              <div className="input-control">
                <label>Pages:</label>
                <input type="number" placeholder="number of pages" onChange={handleInputChange} value={orderDetails.pages} name="pages"/>
              </div>
              <div className="input-control">
                <label>Sources To Cite:</label>
                <input type="number" placeholder="cited sources" onChange={handleInputChange} value={orderDetails.citations} name="citations"/>
              </div>
              <div className="input-control">
                <label>Powerpoint Slides:</label>
                <input type="number" placeholder="powerpoint slides" onChange={handleInputChange} value={orderDetails.slides} name="slides"/>
              </div>
              <div className="input-control">
                <label>Deadline:</label>
                <input type="datetime-local" id="datetimeInput" name="deadline" onChange={handleInputChange} value={orderDetails.deadline}/>
              </div>
              <button>Checkout</button>
            </form>
          </div>
        </div>
        <div className="checkout-section">
          <div className="checkout-card">
            <div className="header">
              {/* find a way to show this in mobile view */}
              <h3>Order Details</h3>
            </div>
            <div className="paper-details">
              <p>Type of paper</p>
              <p>Discipline of paper</p>
            </div>

            <div className="paper-cost">
              <div className="subtotal">
                <p>{orderDetails.pages} pages  </p>
                <p>* ksh 300</p>
              </div>
              <div className="total">
                <p><b>Total Price</b></p>
                <p><b>{orderDetails.pages * 300}</b></p>
              </div>
              <div className="card-footer">
                <p>Secure payments via:</p>
                <img src={paypalImage} alt="paypal-image.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
