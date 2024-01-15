import React, { useEffect, useState } from "react";
import './Dashboard.css'
import { SideNav } from '../../components/sidenav/SideNav'
import { TopNav } from "../topnav/TopNav";
export const Dashboard = () => {
  const[selectedLink,setSelectedLink] = useState(null);
  
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
          <p>{selectedLink}</p>
        </div>
      </div>
    </div>
  );
};
