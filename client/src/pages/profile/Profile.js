import React, { useEffect, useState } from "react";
import "./Profile.css";
import { TopNav } from "../../components/topnav/TopNav";
import {useParams } from 'react-router-dom';
import  axios  from "axios";
import avatar from "../../assets/images/avatar.png"
export const Profile = () => {
  let params = useParams()
  const [userData,setUserData] = useState()

  const getWriterData = async () =>{
      await axios.get(`http://localhost:5000/writers/writer/${params.id}`)
      .then(res=>{
        console.log(res.data)
        setUserData(res.data)
      })
  }
  useEffect(()=>{
    const fetchData =async () => {
      await getWriterData();
    }
    fetchData();
  },[])



  return (
    <div className="main-profile">
      <TopNav />
      <div className="profile-container">
        <div className="profile-header">
          <img src={avatar} alt="Profile Picture" />
          <h1>{userData?.username}</h1>
          <p>{userData?.email}</p>
        </div>
        <div className="profile-bio">
          <h2>About Me</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonummy
            tincidunt ut lacreet dolore magna aliguam erat volutpat. Ut wisis
            enim ad minim veniam, quis nostrud exerci tation ullamcorper
            suscipit lobortis nisl ut aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="profile-skills">
          <h2>Skills</h2>
          <ul>
            <li>Academic Writing</li>
            <li>Research</li>
            <li>Editing and Proofreading</li>
            <li>Creative Writing</li>
          </ul>
        </div>
        <div className="profile-stats">
          <h2>Task Statistics</h2>
          <ul>
            <li>
              <strong>Completed Tasks:</strong> {userData?.assigned_tasks?.length}
            </li>
            <li>
              <strong>In Progress:</strong> 10
            </li>
            <li>
              <strong>Cancelled Tasks:</strong> 5
            </li>
            <li>
              <strong>Tasks in Revision:</strong> 3
            </li>
            <li>
              <strong>Overall Rating:</strong> 4.8
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
