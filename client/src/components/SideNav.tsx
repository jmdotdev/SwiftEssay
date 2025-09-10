import { Link } from 'react-router-dom'
import { X } from 'lucide-react';
import { sideNavLinks } from '@/data/sideNavLinks';

type SideNavProps = {
  onToggle?: () => void
}
export const SideNav = ({ onToggle }: SideNavProps) => {

  return (
    <div className='flex flex-col items-center px-1 py-4 text-white min-h-screen h-auto bg-darkBlue'>
      <button
        className='absolute top-7 right-2 text-white lg:hidden'
        onClick={onToggle}
      >
        <X size={24} />
      </button>
      <div className='flex items-center w-auto'>
        <img className='h-12' src='/images/notepad.png' alt="notepad.png" />
        <b><h3>SwiftEssay</h3></b>
      </div>
      <div className='mt-2'>
        {sideNavLinks.map((link, index) =>
          <Link key={index} className='flex items-center my-6' to={link.url} onClick={onToggle}><div className='text-md'><link.icon className='mr-2' /></div>{link.name}</Link>
        )}
      </div>
    </div>
  )
}
