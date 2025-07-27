import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { TopNav } from "../components/TopNav"
import { SideNav } from "../components/SideNav"
import { useEffect, useState } from "react"

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [header, setHeader]= useState<string>('Dashboard');
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)
  useEffect(() => {
    setHeader(location.pathname.slice(1))
    if(location.pathname !== '/') return;
    navigate('dashboard')
  },[location.pathname])
  return (
    <div className="flex w-full min-h-screen">
         <div className="hidden lg:block w-1/7">
            <SideNav />
         </div>
         <div className="flex flex-col w-full lg:w-6/7">
             <div className="w-full px-4 pt-2">
              <TopNav header={header}/>
             </div>
            <Outlet />
         </div>
    </div>
  )
}
