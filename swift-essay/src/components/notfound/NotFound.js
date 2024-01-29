import React from "react";
import './NotFound.css'
import {Link} from 'react-router-dom'
export const NotFound = () => {

  return (
   <div className="not-found">
  <h1>Page Not Found</h1>
<section class="error-container">
  <span class="four"><span class="screen-reader-text">4</span></span>
  <span class="zero"><span class="screen-reader-text">0</span></span>
  <span class="four"><span class="screen-reader-text">4</span></span>
</section>
<div class="link-container">
  <Link className="link" to="/"><a target="_blank" class="more-link">Go Back Home</a></Link>
</div>
</div>
  );
};
