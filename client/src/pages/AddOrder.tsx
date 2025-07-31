import {useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import {getUserData} from '../utils/getUserData'
import axios from 'axios'
import { academicLevels, citationOptions, orderDiscipline, paperTypes } from "../data/AddOrderFormOptions";
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
    <div className="flex flex-col h-full w-full p-5 overflow-auto">
      <div className="flex justify-center h-full mt-5">
        <div className="flex flex-col w-full md:w-2/3 h-full">
          <div className=" w-full p-0">
            <h2 className="text-xl font-semibold">{params.id ? 'Edit an Order' : 'Place an Order'} </h2>
          </div>
          <div>
            <form onSubmit={params.id ? updateOrder : handleSubmit}>
              <div className="flex flex-col items-start justify-center border-0">
                <label>Academic Level:</label>
                <select className="flex w-5/6 border-0 h-[40px] shadow-inputShadow appearance-none focus: outline-none" onChange={handleInputChange} value={orderDetails.academic_level} name="academic_level">
                  {academicLevels.map(al =><option>{al}</option> )}
                </select>
              </div>
              <div className="flex flex-col items-start justify-center border-0">
                <label>Type:</label>
                <select className="flex w-5/6 border-0 h-[40px] shadow-inputShadow appearance-none focus: outline-none" onChange={handleInputChange} value={orderDetails.type} name="type">
                  {paperTypes.map(type =><option>{type}</option> )}
                </select>
              </div>
              <div className="flex flex-col items-start justify-center border-0">
                <label>Discipline:</label>
                <select className="flex w-5/6 border-0 h-[40px] shadow-inputShadow appearance-none focus: outline-none" onChange={handleInputChange} value={orderDetails.discipline} name="discipline">
                  {orderDiscipline.map(discipline =><option>{discipline}</option> )}
                </select>
              </div>
              <div className="flex flex-col items-start justify-center border-0">
                <label>Topic:</label>
                <input className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 appearance-none focus: outline-none" type="text" placeholder="topic" onChange={handleInputChange} value={orderDetails.topic} name="topic"/>
              </div>
              <div className="flex flex-col items-start justify-center border-0 w-5/6">
                <label>Instructions:</label>
                <textarea className="flex border-0 h-[40px] shadow-inputShadow px-1 appearance-none focus: outline-none" placeholder="paper instructions" onChange={handleInputChange} value={orderDetails.instructions} name="instructions"/>
              </div>
              <div className="flex flex-col items-start justify-center w-5/6 my-2 border-0 bg-gray-100">
                <label>Files:</label>
                <input className="shadow-inputBackground" type="file" multiple onChange={handleFileChange} name="files"/>
              </div>
              <div className="flex flex-col items-start justify-center border-0">
                <label>Page Format</label>
                <select className="flex w-5/6 border-0 h-[40px] shadow-inputShadow appearance-none focus: outline-none" onChange={handleInputChange} value={orderDetails.page_format} name="page_format">
                  {citationOptions.map(option =><option>{option}</option> )}
                </select>
              </div>
              <div className="flex flex-col items-start justify-center border-0">
                <label>Pages:</label>
                <input className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 appearance-none focus: outline-none" type="number" placeholder="number of pages" onChange={handleInputChange} value={orderDetails.pages} name="pages"/>
              </div>
              <div className="flex flex-col items-start justify-center border-0">
                <label>Sources To Cite:</label>
                <input className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 appearance-none focus: outline-none" type="number" placeholder="cited sources" onChange={handleInputChange} value={orderDetails.citations} name="citations"/>
              </div>
              <div className="flex flex-col items-start justify-center border-0">
                <label>Powerpoint Slides:</label>
                <input className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 appearance-none focus: outline-none" type="number" placeholder="powerpoint slides" onChange={handleInputChange} value={orderDetails.slides} name="slides"/>
              </div>
              <div className="flex flex-col items-start justify-center border-0">
                <label>Deadline:</label>
                <input className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 appearance-none focus: outline-none" type="datetime-local" id="datetimeInput" name="deadline" onChange={handleInputChange} value={orderDetails.deadline}/>
              </div>
              <button className="flex items-center justify-center px-4 py-2 rounded-md w-1/4 my-2 bg-darkBlue text-white border-0 cursor-pointer">Checkout</button>
            </form>
          </div>
        </div>
        <div className="hidden md:block md:w-1/3 mt-6">
          <div className="flex flex-col items-start w-full h-1/2 bg-darkBlue text-white rounded-sm shadow-inputShadow p-2">
            <div className="w-full py-2 px-0">
              {/* find a way to show this in mobile view */}
              <h3>Order Details</h3>
            </div>
            <div className="w-full border-b-[1px] border-gray-600">
              <p>Type of paper</p>
              <p>Discipline of paper</p>
            </div>

            <div className="flex flex-col w-full h-full">
              <div className="flex items-center justify-between w-full my-2 border-b-[1px] border-gray-600">
                <p>{orderDetails.pages} pages  </p>
                <p>* ksh 300</p>
              </div>
              <div className="flex items-center justify-between">
                <p><b>Total Price</b></p>
                <p><b>{orderDetails.pages * 300}</b></p>
              </div>
              <div className="flex items-end h-full">
                <p>Secure payments via:</p>
                <img src='/images/paypal.png' alt="paypal-image.png"  className="h-8"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
