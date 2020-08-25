//adapted from Treehouse Techdegree Unit 10 React Authentication example project
//renders header displayed for all pages
import React from 'react';
import {NavLink} from 'react-router-dom';

function Header(props) {

  const { context } = props;
  const authUser = context.authenticatedUser;

return (
<div className="header">
    <div className="bounds">
      <h1 className="header--logo">Courses</h1>
      <nav>
        {authUser ? ( //if there is an authorized user signed in, then display their name and a logout link, if not, display "sign in" and "sign up" links
        <React.Fragment>
          <span>Welcome, {authUser.firstName + " " + authUser.lastName}!</span><NavLink className="/signout" to="/signout">Sign Out</NavLink>
          </React.Fragment> ):
        (<React.Fragment>
          <NavLink className="signup" to="/signup">Sign Up</NavLink><NavLink className="/signin" to="/signin">Sign In</NavLink>
          </React.Fragment>)
      }
        </nav>
      
    </div>
  </div>

    );

}

export default Header;