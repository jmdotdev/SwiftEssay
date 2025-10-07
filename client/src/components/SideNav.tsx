import { Link, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react';
import { sideNavLinks } from '@/data/sideNavLinks';
import { useState } from 'react';
import { SideNav as ISideNav} from '@/types/sideNav';

type SideNavProps = {
  onToggle?: () => void
}
export const SideNav = ({ onToggle }: SideNavProps) => {
  const [links, setLinks] = useState<ISideNav[]>(sideNavLinks);
  const navigate = useNavigate();
  const activateLink = (l: ISideNav) => {
    setLinks(links.map((link) => ({
       ...link,
      isActive: link.name.toLowerCase() === l.name.toLowerCase() ? true : false
    })));
    navigate(`/${l.url}`)
    onToggle();
  }

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
        {links.map((link, index) =>
          <div key={index} className='flex items-center my-6 cursor-pointer' onClick={() => activateLink(link)}><div className='text-md'>
            <link.icon className='mr-2' color={link.isActive ? 'red' : 'white'}/></div><h3 className={`${link.isActive && 'font-bold text-red-500'}`}>{link.name}</h3></div>
        )}
      </div>
    </div>
  )
}
