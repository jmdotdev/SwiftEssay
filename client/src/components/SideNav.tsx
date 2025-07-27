import { Link } from 'react-router-dom'
import { Icon } from 'lucide-react';
import { sideNavLinks } from '../data/sideNavLinks';


export const SideNav = () => {

  return (
    <div className='flex flex-col items-center px-1 py-4 text-white min-h-screen h-auto bg-darkBlue'>
      <div className='flex items-center w-auto'>
        <img className='h-12' src='/images/notepad.png' alt="notepad.png" />
        <b><h3>SwiftEssay</h3></b>
      </div>
      <div className='mt-2'>
        {sideNavLinks.map((link, index) =>
          <Link key={index} className='flex items-center my-6' to={link.url}><div className='text-md'><link.icon className='mr-2' /></div>{ link.name }</Link>
        )}
      </div>
    </div>
  )
}
