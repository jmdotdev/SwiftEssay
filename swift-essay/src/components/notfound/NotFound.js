import React from "react";
import './NotFound.css'
import {Link} from 'react-router-dom'
export const NotFound = () => {
  return (
  <div className="notFound">
      <div className="mars"></div>
<img src="https://assets.codepen.io/1538474/404.svg" className="logo-404" />
<img src="https://assets.codepen.io/1538474/meteor.svg" className="meteor" />
<p className="title">Oh no!!</p>
<p className="subtitle">
	You’re either misspelling the URL <br /> or requesting a page that's no longer here.
</p>
<div align="center">
	<Link className="homeLink" to="/dashboard" >
  <a className="btn-back">Back to previous page</a>
  </Link>
</div>
<img src="https://assets.codepen.io/1538474/astronaut.svg" className="astronaut" />
<img src="https://assets.codepen.io/1538474/spaceship.svg" className="spaceship" />
  </div>
  );
};
