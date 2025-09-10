import { useLocation } from 'react-router-dom';
import './App.css';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/notfound/NotFound'
import { Routes, Route } from "react-router-dom";
import { Writers } from './pages/Writers';
import { AddOrder } from './pages/AddOrder';
import { OrderDetails } from './pages/OrderDetails'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Profile } from './pages/Profile';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Payments } from './pages/Payments';
import { Auth } from './guards/Auth';

function App() {

  return (
    <div className="app flex bg-siteBackground">
      <ToastContainer />
      <Routes>
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route element={<Auth> <DashboardLayout /></Auth>} >
          <Route index element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='writers' element={<Writers />} />
          <Route path='profile/:id' element={<Profile />} />
          <Route path='orders' element={<Orders />} />
          <Route path='orders/add-order' element={<AddOrder />} />
          <Route path='orders/add-order/:id' element={<AddOrder />} />
          <Route path='orders/order-details/:id' element={<OrderDetails />} />
          <Route path='payments' element={<Payments />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
