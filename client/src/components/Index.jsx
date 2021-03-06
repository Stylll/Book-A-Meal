import React from 'react';
import { NavLink } from 'react-router-dom';
import Main from './Main';

const Index = () => (
    <Main allowAnonymous allowCaterer allowCustomer>
      <div className="main">
      <div className="container text-center white-text level-one">
        <div className="content">
          <h1 className="title">Book-A-Meal</h1>
          <p className="sub-text">Your online restaurant to find the finest cuisines</p>
          <h3>BAM is an application where customers can make food orders and caterers
            can know what a customer whats to eat</h3>
          <h3>We create a platform for customers to enjoy classy and tasty meals
            while leveraging the finesse of our world class caterers who are masters
            of their craft
          </h3>
          <h3 className="normal-text">
          <NavLink to="/users/signup" className="secondary-text-color">
          Click here&nbsp;
          </NavLink>
          to join and become our customer or caterer</h3>
          <h3 className="normal-text">You can&nbsp;
          <NavLink to="/users/signin" className="secondary-text-color">
          sign in here
          </NavLink> if you are already one of us
          </h3>
        </div>
      </div>
    </div>
    </Main>
);

export default Index;
