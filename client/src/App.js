import { useEffect, useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import './App.css';
import { Login } from './pages/login/Login';
import { Register } from './pages/register/Register';
import { NotFound } from './pages/notfound/NotFound'
import { Routes, Route } from "react-router-dom";
import { SideNav } from './components/sidenav/SideNav';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Writers } from './pages/writers/Writers';
import {Orders} from './pages/Orders/Orders'
import { AddOrder } from './pages/Orders/AddOrder/AddOrder';
import {OrderDetails} from './pages/Orders/OrderDetails/OrderDetails'
import {Payment} from  './pages/Payment/Payment'
import { Profile } from './pages/profile/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuth,setAuth] = useState(false);

  // List of routes where you want to hide the SideNav
  const excludedRoutes = ['login','/register', '*'];

  // Check if the current route is in the excludedRoutes list
  const isExcludedRoute = excludedRoutes.some(route => location.pathname.includes(route));

  // Redirect to a different route if needed (e.g., redirect from '/' to '/login')
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  return (
    <div className="App">
            <ToastContainer />
      {!isExcludedRoute && <SideNav />}
      <Routes>
      <Route exact path='login' element={<Login  setAuth = {setAuth}/>} />
      <Route path='register' element={<Register/>}/>
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route path='writers' element={<Writers/>} />
      <Route path='profile/:id' element={<Profile/>}/>
      <Route path='orders' element={<Orders  isAuth={isAuth}/>}/>
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
