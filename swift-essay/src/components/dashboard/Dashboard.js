import React from "react";
import './Dashboard.css'
import { SideNav } from '../../components/sidenav/SideNav'
import { TopNav } from "../topnav/TopNav";
export const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="sidenav">
        <SideNav/>
      </div>
      <div className="container">
        <div className="top-nav">
          <TopNav/>
        </div>
        <div className="container-content">
          <p>content</p>
        </div>
      </div>
    </div>
  );
};
