import React from 'react';

const NavBar = (props) => {
  return (
    <nav className="navbar primary-bg-color flex-display-nav">
      <div className="navitem flexleft"><a href="./orders/order-menu.html" className="navlink logo-text">Book-A-Meal</a></div>
      <div className="navitem"><a href="./users/signin.html" className="navlink">Sign In</a></div>
      <div className="navitem"><a href="./users/signup.html" className="navlink">Sign Up</a></div>
  </nav>
  );
};

export default NavBar;