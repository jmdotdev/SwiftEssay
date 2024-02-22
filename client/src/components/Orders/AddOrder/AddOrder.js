import {React,useState} from "react";
import { TopNav } from "../../topnav/TopNav";
import "./AddOrder.css";
import {orderDiscipline,paperTypes,citationOptions,academicLevels} from './AddOrderFormOptions'
import paypalImage from '../../../../src/assets/images/paypal.png'
import axios from 'axios'
export const AddOrder = () => {
  const [orderDetails, setOrderDetails] = useState({
    academic_level: "",
    type: "",
    discipline: "",
    topic: "",
    instructions: "",
    files: [],
    page_format: "",
    pages: 0,
    single_or_double: "",
    sourcesToCite: 0,
    powerpointSlides: 0,
    deadline: "",
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setOrderDetails({ ...orderDetails, files });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(orderDetails).forEach(([key, value]) => {
        if (key === "files") {
          value.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
          });
        } else {
          formData.append(key, value);
        }
      });
      console.log("orderdetals",orderDetails)
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      await axios.post("http://localhost:5000/orders/createOrder",formData)
      .then(res=>console.log(res))

      // console.log("Order submitted successfully!");
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };


  return (
    <div className="main-container">
      <TopNav />
      <div className="add-order-container">
        <div className="add-order-form">
          <div className="header">
            <h2>Place an Order</h2>
            <p>Fast,Secure and Reliable</p>
          </div>
          <div className="order-form">
            <form onSubmit={handleSubmit}>
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
                <input type="file" multiple onChange={handleFileChange}/>
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
                <label>Double/Single:</label>
                <input type="text" placeholder="double or single" onChange={handleInputChange} value={orderDetails.single_or_double} name="single_or_double"/>
              </div>
              <div className="input-control">
                <label>Sources To Cite:</label>
                <input type="number" placeholder="cited sources" onChange={handleInputChange} value={orderDetails.sourcesToCite} name="sourcesToCite"/>
              </div>
              <div className="input-control">
                <label>Powerpoint Slides:</label>
                <input type="number" placeholder="powerpoint slides" onChange={handleInputChange} value={orderDetails.powerpointSlides} name="powerpointSlides"/>
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
                <p>1 page * USD 3</p>
                <p>USD 3.00</p>
              </div>
              <div className="total">
                <p><b>Total Price</b></p>
                <p><b>USD 3.00</b></p>
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
