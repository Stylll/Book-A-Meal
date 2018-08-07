import React from 'react';
import { NavLink } from 'react-router-dom';
import Main from '../Main';
import sadFace from '../../assets/sad.png';

export default class NotFound extends React.Component {
  render() {
    return (
      <div className="container text-center">
        <br /><br /><br />
        <img src={sadFace} alt="sad-face" className="img-responsive" />
        <h3>Sorry. it seems you're trying to get a dish that does not exist</h3>
        <br />
        <NavLink to="/">Take me home</NavLink>
      </div>
    );
  }
}
