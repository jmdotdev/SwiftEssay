import {React,useState} from "react";
import { TopNav } from "../../topnav/TopNav";
import "./AddOrder.css";
import {orderDiscipline,paperTypes,citationOptions,academicLevels} from './AddOrderFormOptions'
import paypalImage from '../../../../src/assets/images/paypal.png'
export const AddOrder = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) =>{
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
    console.log(selectedFiles)
  }
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
            <form>
              <div className="input-control">
                <label>Academic Level:</label>
                <select>
                  {academicLevels.map(al =><option>{al}</option> )}
                </select>
              </div>
              <div className="input-control">
                <label>Type:</label>
                <select>
                  {paperTypes.map(type =><option>{type}</option> )}
                </select>
              </div>
              <div className="input-control">
                <label>Discipline:</label>
                <select>
                  {orderDiscipline.map(discipline =><option>{discipline}</option> )}
                </select>
              </div>
              <div className="input-control">
                <label>Topic:</label>
                <input type="text" placeholder="topic" />
              </div>
              <div className="input-control">
                <label>Instructions:</label>
                <textarea type="text" placeholder="paper instructions" />
              </div>
              <div className="input-control">
                <label>Files:</label>
                <input type="file" multiple onChange={handleFileChange}/>
              </div>
              <div className="input-control">
                <label>Page Format</label>
                <select>
                  {citationOptions.map(option =><option>{option}</option> )}
                </select>
              </div>
              <div className="input-control">
                <label>Pages:</label>
                <input type="number" placeholder="number of pages" />
              </div>
              <div className="input-control">
                <label>Double/Single:</label>
                <input type="text" placeholder="double or single" />
              </div>
              <div className="input-control">
                <label>Sources To Cite:</label>
                <input type="number" placeholder="cited sources" />
              </div>
              <div className="input-control">
                <label>Powerpoint Slides:</label>
                <input type="number" placeholder="powerpoint slides" />
              </div>
              <div className="input-control">
                <label>Deadline:</label>
                <input type="datetime-local" id="datetimeInput" name="datetimeInput"/>
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
