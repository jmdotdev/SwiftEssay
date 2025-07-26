import { useLocation } from 'react-router-dom';
import './App.css';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/notfound/NotFound'
import { Routes, Route } from "react-router-dom";
import { SideNav } from './components/SideNav';
import { Writers } from './pages/Writers';
import { AddOrder } from './pages/Orders/AddOrder/AddOrder';
import {OrderDetails} from './pages/Orders/OrderDetails/OrderDetails'
import {Payment} from  './pages/Payment/Payment'
import { Profile } from './pages/profile/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';

function App() {
  const location = useLocation();

  // List of routes where you want to hide the SideNav
  const excludedRoutes = ['login','/register', '*'];

  // Check if the current route is in the excludedRoutes list
  const isExcludedRoute = excludedRoutes.some(route => location.pathname.includes(route));


  return (
    <div className="app flex bg-siteBackground">
            <ToastContainer />
      {!isExcludedRoute && <SideNav />}
      <Routes>
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register/>}/>
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route path='writers' element={<Writers/>} />
      <Route path='profile/:id' element={<Profile/>}/>
      <Route path='orders' element={<Orders />}/>
      <Route path='orders/add-order' element={<AddOrder/>}/>
      <Route path='orders/add-order/:id' element={<AddOrder/>}/>
      <Route path='orders/order-details/:id' element={<OrderDetails/>}/>
      <Route path='payments' element={<Payment/>}/>
      <Route path='*' element={<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
