import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = props => (
    <nav className="navbar primary-bg-color flex-display-nav">
      <div className="navitem flexleft">
      <NavLink to="/" className="navlink logo-text">
          Book-A-Meal
          </NavLink>
      </div>
      <div className="navitem">
      <NavLink to="/users/signin" className="navlink">
          Sign In
      </NavLink>
      </div>
      <div className="navitem">
      <NavLink to="/users/signup" className="navlink">
          Sign Up
      </NavLink>
      </div>
  </nav>
);

export default NavBar;