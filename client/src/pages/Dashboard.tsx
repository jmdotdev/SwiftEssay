import {useEffect,useState} from 'react'
import axios from 'axios'
import { OrderCard } from '../components/OrderCard';
import { OrderTable } from '@/components/OrderTable';
import { AddPaymentModal } from '@/components/AddPaymentModal';

export const Dashboard = () => {
    const [latestOrders,setLatestOrders] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const getOrders = async () =>{
      await axios.get("http://localhost:5000/orders/getOrders").then((res) => {
        setLatestOrders(res.data)
      });
    }

    const handleShowAddPaymentModal = (id: string) => {
        console.log('id',id)
        setShowPaymentModal(prev => !prev);
    }

  useEffect(() => {
    const fetchData = async () => {
      // await verifyToken(setLoggedInUser, setIsLoggedIn, navigate);
      await getOrders();
    };

    fetchData();
  }, []);
  return (
    <div className='flex flex-col w-full h-[calc(100vh-100px)] px-5 py-0'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 justify-between h-auto w-full my-6'>
          <OrderCard orderCount={(latestOrders.filter(ord=>ord.status === 'available')).length} orderType='Available' Icon='/images/pending.svg'/>
          <OrderCard orderCount={(latestOrders.filter(ord=>ord.status === 'revision')).length} orderType='Revision' Icon='/images/repeat.svg'/>
          <OrderCard orderCount={(latestOrders.filter(ord=>ord.status === 'progress')).length} orderType='In Progress' Icon='/images/progress.jpg'/>
          <OrderCard orderCount={(latestOrders.filter(ord=>ord.status === 'canceled')).length} orderType='Canceled' Icon='/images/cancel.png'/>
          <OrderCard orderCount={(latestOrders.filter(ord=>ord.status === 'completed')).length} orderType='Completed' Icon='/images/complete.jpg'/>
        </div>
        <div className='flex flex-col h-auto w-full bg-white rounded-xl'>
          <h2 className='text-md text-start mt-4 mx-4 font-semibold text-darkBlue'>Latest Orders</h2>
    <div className='px-4'>
       <OrderTable orders={latestOrders} openAddPaymentModal={ (id: string) => handleShowAddPaymentModal(id) } />
    </div>
    {
      showPaymentModal && 
      <AddPaymentModal isOpen={true} handleClose={() => setShowPaymentModal(prev => !prev)}/>
    }
        </div>
    </div>
  )
}
