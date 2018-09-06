import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

/**
 * stateless component to render meal item
 * @param {object} {meal, handleDelete}
 * @returns {object} rendered component
 */
const MealItem = ({
  meal, handleDelete, showEdit, showDelete, showOrder,
}) => (
    <div className="card flex-display">
          <div className="card-img-container">
            <img src={meal.image} alt="meal-image" className="card-img" />
          </div>
          <div className="card-content">
            <div className="card-text black-text">
              <h3 data-for="title" data-tip={meal.name} className="black-text bold-text wrap-text">{meal.name}</h3>
              <h4 data-for="price"
                data-tip={meal.price}
                className="black-text light-text wrap-text">Price: &#8358;{meal.price}</h4>
              {meal.user && meal.user.username &&
                <h4 className="black-text light-text wrap-text">Caterer: {meal.user.username}</h4>
              }
              {showOrder &&
              <NavLink to={`/customer/orders/confirm/${meal.id}`} className="btn btn-secondary">Order</NavLink>
              }
              &nbsp;&nbsp;
              {showEdit &&
              <NavLink to={`/caterer/meals/edit/${meal.id}`} className="btn btn-secondary">Edit</NavLink>
              }
              &nbsp;&nbsp;
              { /* eslint-disable react/jsx-no-bind */}
              {showDelete &&
              <a href="" onClick={e => handleDelete(e, meal.id)} className="btn btn-danger">Delete</a>
              }
              <br />
              <br />
            </div>
            <ReactTooltip id="title" delayShow={400} className="tooltip" />
            <ReactTooltip id="price" delayShow={400} className="tooltip" />
          </div>
        </div>
);

MealItem.propTypes = {
  meal: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  showEdit: PropTypes.bool,
  showDelete: PropTypes.bool,
  showOrder: PropTypes.bool,
};

MealItem.defaultProps = {
  showEdit: true,
  showDelete: true,
  showOrder: false,
};

export default MealItem;
