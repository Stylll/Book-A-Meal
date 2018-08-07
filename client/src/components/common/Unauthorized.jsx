import React from 'react';
import { NavLink } from 'react-router-dom';
import Main from '../Main';
import unauthorizedEmoji from '../../assets/security.gif';

export default class Unauthorized extends React.Component {
  render() {
    return (
      <div className="container text-center">
        <br /><br /><br /><br /><br /><br />
        <img src={unauthorizedEmoji} alt="sad-face" className="img-responsive" />
        <h3>Sorry. You don't have access to view the page you requested for</h3>
        <br />
        <NavLink to="/">Take me home</NavLink>
      </div>
    );
  }
}
