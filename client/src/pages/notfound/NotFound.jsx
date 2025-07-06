import React from "react";
import './NotFound.css'
import {Link} from 'react-router-dom'
export const NotFound = () => {

  return (
   <div className="not-found">
  <h1>Page Not Found</h1>
<section className="error-container">
  <span className="four"><span className="screen-reader-text">4</span></span>
  <span className="zero"><span className="screen-reader-text">0</span></span>
  <span className="four"><span className="screen-reader-text">4</span></span>
</section>
<div className="link-container">
  <Link className="link" to="/"><a target="_blank" className="more-link">Go Back Home</a></Link>
</div>
</div>
  );
};
