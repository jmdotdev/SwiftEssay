import { Link } from 'react-router-dom'
import { Banknote, GraduationCap, LayoutDashboard, ShoppingBag } from 'lucide-react';


export const SideNav = () => {

  return (
    <div className='hidden md:flex flex-col items-center px-1 py-4 text-white h-screen w-1/6 bg-darkBlue'>
     <div className='d-flex items-center w-auto'>
     <img className='h-12'  src='/images/notepad.png' alt="notepad.png"/>
            <b><h3>SwiftEssay</h3></b>
     </div>
      <div className='mt-2'>
        <Link className='flex items-center my-6' to="dashboard"><div className='text-md'><LayoutDashboard className='mr-2' /></div>Dashboard</Link>
        <Link className='flex items-center my-6' to="writers"><div className='text-md'><GraduationCap className='mr-2'/></div>Writers</Link>
        <Link className='flex items-center my-6' to="orders"><div className='text-md'><ShoppingBag className='mr-2'/></div>Orders</Link>
        <Link className='flex items-center my-6' to="payments"><div className='text-md'><Banknote className='mr-2'/></div>Payments</Link>
        {/* <li>Reviews</li>
        <li>News</li> */}
      </div>
    </div>
  )
}
