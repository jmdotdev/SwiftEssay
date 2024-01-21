import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Dashboard.css";
import { SideNav } from "../../components/sidenav/SideNav";
import { TopNav } from "../topnav/TopNav";
import { DashboardContent } from "../dashboard-content/DashboardContent";
import { Orders } from "../Orders/Orders";
import { Writers } from "../writers/Writers";
import { Payment } from "../Payment/Payment";
import { Messages } from "../messages/Messages";
export const Dashboard = () => {
  const { link } = useParams();
  const [selectedLink, setSelectedLink] = useState(link || "dashboard");
  const navigate = useNavigate();
  const componentsList=["dashboard","Writers","Orders","Payments","Messages"]
  const handleSelectedLink = (link) => {
    setSelectedLink(link);
    if(componentsList.includes(link)){
     navigate(`/${link}`);
     console.log(link)
    }
    else{
      console.log(link)
      navigate('/notfound')
    }
  };

  return (
    <div className="dashboard">
      <div className="sidenav">
        <SideNav onLinkClick={handleSelectedLink} />
      </div>
      <div className="container">
        <div className="top-nav">
          <TopNav />
        </div>
        <div className="container-content">
          {selectedLink == "dashboard" && (
            <p>
              <DashboardContent />
            </p>
          )}
          {selectedLink == "Writers" && (
            <p>
              <Writers />
            </p>
          )}
          {selectedLink == "Orders" && (
            <p>
              <Orders />
            </p>
          )}
          {selectedLink == "Payments" && (
            <p>
              <Payment />
            </p>
          )}
          {selectedLink == "Messages" && (
            <p>
              <Messages />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
