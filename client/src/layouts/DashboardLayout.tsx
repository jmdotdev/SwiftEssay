import { Outlet, useLocation } from "react-router-dom"
import { TopNav } from "../components/TopNav"
import { SideNav } from "../components/SideNav"
import { useEffect, useState } from "react"

export const DashboardLayout = () => {
  const location = useLocation();
  const [header, setHeader] = useState<string>('Dashboard');
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)
  const toggleNav = () => {
    setIsSideNavOpen(prev => !prev)
  }
  useEffect (() => {
    const pathNameArray = location.pathname.split('/');
    setHeader(pathNameArray[pathNameArray.length-1])
  },[location])
  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar for large screens */}
      <div className="hidden lg:block w-1/7">
        <SideNav />
      </div>
      {/* Sidebar for small screens */}
      {isSideNavOpen && (
        <div className="block lg:hidden fixed inset-y-0 left-0 z-50 w-1/3 shadow-lg">
          <SideNav onToggle={() => setIsSideNavOpen(false)} />
        </div>
      )}
      <div className="flex flex-col w-full lg:w-6/7 max-h-screen overflow-auto">
        <div className="w-full px-4 mt-3">
          <TopNav header={header} toggleNav={toggleNav} />
        </div>
        <Outlet />
      </div>
    </div>
  )
}
