import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Display from './Display';

const NavBar = ({
  user, isAuthenticated, isCaterer, logout, expandNav, toggleNav,
}) => (
    <div>
      <Display check={!isCaterer && isAuthenticated}>
        <nav className="navbar primary-bg-color flex-display-nav">
          <div className="navitem flexleft">
            <NavLink to="/" className="navlink logo-text navicon">
              Book-A-Meal
            </NavLink>
          </div>
          <div className="navitem">
            <NavLink to="/customer/menu" className="navlink">View Menu</NavLink>
          </div>
          <div className="navitem dropdown">
            <a href="#" onClick={toggleNav} className="navlink">Orders</a>
              <div className="dropdown-content">
                <NavLink to="/customer/orders/pending">Pending Orders</NavLink>
                <NavLink to="/customer/orders">Order History</NavLink>
              </div>
          </div>
          <div className="navitem dropdown">
            <a href="#" onClick={toggleNav} className="navlink">Welcome, {user.username}</a>
              <div className="dropdown-content">
                <NavLink to="/users/profile">My Profile</NavLink>
                <NavLink to="" onClick={logout}>Logout</NavLink>
              </div>
          </div>
          <div className="navitem flexright breadcrumb">
            <NavLink to="" id="nav-trigger" onClick={expandNav} className="navlink">&#9776;</NavLink>
          </div>
        </nav>
      </Display>
      <Display check={isCaterer && isAuthenticated}>
        <nav className="navbar primary-bg-color flex-display-nav">
          <div className="navitem flexleft">
            <NavLink to="/" className="navlink logo-text navicon">
              Book-A-Meal
            </NavLink>
          </div>
          <div className="navitem dropdown">
            <a href="#" onClick="toggleNav(this); return false;" className="navlink">Menus</a>
            <div className="dropdown-content">
              <NavLink to="/caterer/menus/edit">New Menu</NavLink>
              <NavLink to="/caterer/menus">Manage Menu</NavLink>
            </div>
          </div>
          <div className="navitem dropdown">
            <a href="#" onClick="toggleNav(this); return false;" className="navlink">Meals</a>
            <div className="dropdown-content">
              <NavLink to="/caterer/meals/edit">New Meal</NavLink>
              <NavLink to="/caterer/meals">Manage Meals</NavLink>
            </div>
          </div>
          <div className="navitem dropdown">
            <a href="#" onClick="toggleNav(this); return false;" className="navlink">Orders</a>
            <div className="dropdown-content">
              <NavLink to="/caterer/orders/pending">Pending Orders</NavLink>
              <NavLink to="/caterer/orders/history">Order History</NavLink>
              <NavLink to="/caterer/orders/summary">Order Summary</NavLink>
            </div>
          </div>
          <div className="navitem dropdown">
            <a href="#" onClick="toggleNav(this); return false;" className="navlink">Welcome, {user.username}</a>
              <div className="dropdown-content">
                <NavLink to="/users/profile">My Profile</NavLink>
                <NavLink to="" onClick={logout}>Logout</NavLink>
              </div>
          </div>
          <div className="navitem flexright breadcrumb">
            <NavLink to="" id="nav-trigger" onClick={expandNav} className="navlink">&#9776;</NavLink>
          </div>
        </nav>
      </Display>
      <Display check={!isAuthenticated}>
        <nav className="navbar primary-bg-color flex-display-nav">
          <div className="navitem flexleft">
          <NavLink to="/" className="navlink logo-text navicon">
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
          <div className="navitem flexright breadcrumb">
            <NavLink to="" id="nav-trigger" onClick={expandNav} className="navlink">&#9776;</NavLink>
          </div>
        </nav>
      </Display>
    </div>
);

NavBar.propTypes = {
  user: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isCaterer: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  expandNav: PropTypes.func.isRequired,
  toggleNav: PropTypes.func.isRequired,
};

export default NavBar;
