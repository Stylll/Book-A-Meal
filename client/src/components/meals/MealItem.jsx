import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

/**
 * stateless component to render meal item
 * @param {object} {meal, handleDelete}
 * @returns {object} rendered component
 */
const MealItem = ({ meal, handleDelete }) => (
    <div className="card flex-display">
          <div className="card-img-container">
            <img src={meal.image} alt="meal-image" className="card-img" />
          </div>
          <div className="card-content">
            <div className="card-text black-text">
              <h3 className="black-text bold-text">{meal.name}</h3>
              <h4 className="black-text light-text">Price: &#8358;{meal.price}</h4>
              <NavLink to={`/caterer/meals/edit/${meal.id}`} className="btn btn-secondary">Edit</NavLink>
              &nbsp;&nbsp;
              { /* eslint-disable react/jsx-no-bind */}
              <a href="" onClick={e => handleDelete(e, meal.id)} className="btn btn-danger">Delete</a>
              <br />
              <br />
            </div>
          </div>
        </div>
);

MealItem.propTypes = {
  meal: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default MealItem;