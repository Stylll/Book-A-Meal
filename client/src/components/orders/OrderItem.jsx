import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { beautifyDate } from '../../utils/utils';

/**
 * stateless component to render meal item
 * @param {object} {meal, handleDelete}
 * @returns {object} rendered component
 */
const OrderItem = ({
  order, handleDelete, showEdit, showDelete, showCustomer, showStatus,
}) => (
    <div className="card flex-display">
          <div className="card-img-container">
            <img src={order.meal.image} alt="order-image" className="card-img" />
          </div>
          <div className="card-content">
            <div className="card-text black-text">
              <h4 className="black-text light-text">{`#${order.id} - ${beautifyDate(order.createdAt)}`}</h4>
              <h3 className="black-text bold-text">{order.meal.name}</h3>
              <h4 className="black-text light-text">Price: &#8358;{order.price} x QTY: {order.quantity} = &#8358;{order.cost}</h4>
              {showStatus && order.status === 'canceled' &&
              <h4
                className="black-text light-text error-text">Status: {order.status}</h4>
              }
              {showStatus && order.status === 'pending' &&
              <h4
                className="black-text light-text warning-text">Status: {order.status}</h4>
              }
              {showStatus && order.status === 'complete' &&
              <h4
                className="black-text light-text success-text">Status: {order.status}</h4>
              }
              &nbsp;&nbsp;
              {showEdit &&
              <NavLink to={`/customer/orders/edit/${order.id}`} className="btn btn-secondary">Edit</NavLink>
              }
              &nbsp;&nbsp;
              { /* eslint-disable react/jsx-no-bind */}
              {showDelete &&
              <a href="" onClick={e => handleDelete(e, order)} className="btn btn-danger">Cancel</a>
              }
              {showCustomer &&
              <h4 className="black-text light-text">Order By: {order.user.username}</h4>
              }
              <br />
              <br />
            </div>
          </div>
        </div>
);

OrderItem.propTypes = {
  order: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  showEdit: PropTypes.bool,
  showDelete: PropTypes.bool,
  showCustomer: PropTypes.bool,
  showStatus: PropTypes.bool,
};

OrderItem.defaultProps = {
  showEdit: false,
  showDelete: false,
  showCustomer: false,
  showStatus: false,
};

export default OrderItem;
