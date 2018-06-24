import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const MenuItem = ({ menu }) => (
  <div className="hor-card flex-display menu container">
        <div className="flexleft">
          <h3 className="black-text bold-text">{menu.name}</h3>
        </div>
        <div className="menu-item">
          <NavLink to={`/caterer/menus/edit/${menu.id}`}>Edit</NavLink>
        </div>
        <div className="menu-item">
          <NavLink to={`/caterer/menus/view/${menu.id}`}>View</NavLink>
        </div>
      </div>
);

MenuItem.propTypes = {
  menu: PropTypes.object.isRequired,
};

export default MenuItem;
