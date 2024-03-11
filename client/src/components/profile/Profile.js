import React from 'react'
import './Profile.css'
import {TopNav} from '../topnav/TopNav.js'
export const Profile = () => {
  return (
<div className='main-profile'>
    <TopNav/>
  <div className="profile-container">
    <div className="profile-header">
      <img src="profile-picture.jpg" alt="Profile Picture" />
      <h1>John Doe</h1>
      <p>Freelance Writer</p>
    </div>
    <div className="profile-bio">
      <h2>About Me</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonummy
        tincidunt ut lacreet dolore magna aliguam erat volutpat. Ut wisis enim
        ad minim veniam, quis nostrud exerci tation ullamcorper suscipit
        lobortis nisl ut aliquip ex ea commodo consequat.
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
          <strong>Completed Tasks:</strong> 50
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
 
  )
}
