import React, { useEffect, useState } from "react";
import './Dashboard.css'
import { SideNav } from '../../components/sidenav/SideNav'
import { TopNav } from "../topnav/TopNav";
import { DashboardContent } from "../dashboard-content/DashboardContent";
import { Orders } from "../Orders/Orders";
export const Dashboard = () => {
  const[selectedLink,setSelectedLink] = useState("dashboard");
  
  const handleSelectedLink = (link) =>{
      setSelectedLink(link)
  }
 
  return (
    <div className="dashboard">
      <div className="sidenav">
        <SideNav onLinkClick={handleSelectedLink}/>
      </div>
      <div className="container">
        <div className="top-nav">
          <TopNav/>
        </div>
        <div className="container-content">
          { selectedLink == "dashboard" ? <p><DashboardContent/></p> : <Orders/>}
        </div>
      </div>
    </div>
  );
};
