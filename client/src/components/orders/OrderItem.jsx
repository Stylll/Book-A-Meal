import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { beautifyDate } from '../../utils/utils';

/**
 * stateless component to render meal item
 * @param {object} {meal, handleDelete}
 * @returns {object} rendered component
 */
const OrderItem = ({
  order, handleDelete, showEdit, showDelete, showCustomer, showStatus,
  handleApprove, handleDecline, showApprove, showDecline,
}) => (
    <div className="card flex-display">
          <div className="card-img-container">
            <img src={order.meal.image} alt="order-image" className="card-img" />
          </div>
          <div className="card-content">
            <div className="card-text black-text">
              <h4 className="black-text light-text">{`#${order.id} - ${beautifyDate(order.createdAt)}`}</h4>
              <h3 data-for="title"
                data-tip={order.meal.name}
                className="black-text bold-text wrap-text">
                  {order.meal.name}</h3>
              <h4 data-for="price"
                data-tip={`${order.price} x ${order.quantity} = ${order.cost}`}
                className="black-text light-text wrap-text">
              Price: &#8358;{order.price} x QTY: {order.quantity} = &#8358;{order.cost}</h4>
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
              {showCustomer &&
              <h4 data-for="customer"
                data-tip={order.user.username}
                className="black-text light-text card-title">Order by: {order.user.username}</h4>
              }
              { (showEdit || showDelete) &&
                <div className="padding-bottom padding-top">
                  {showEdit &&
                    <NavLink to={`/customer/orders/edit/${order.id}`} className="btn btn-secondary">Edit</NavLink>
                  }
                  &nbsp;&nbsp;
                  { /* eslint-disable react/jsx-no-bind */}
                  {showDelete &&
                    <a href="" onClick={e => handleDelete(e, order)} className="btn btn-danger">Cancel</a>
                  }
                </div>
              }
              { (showApprove || showDecline) &&
                <div className="padding-bottom padding-top">
                  {showApprove &&
                    <a href="" onClick={e => handleApprove(e, order)} className="btn btn-secondary">Approve</a>
                  }
                  &nbsp;&nbsp;
                  {showDecline &&
                    <a href="" onClick={e => handleDecline(e, order)} className="btn btn-danger">Decline</a>
                  }
                </div>
              }
            </div>
          </div>
          <ReactTooltip id="title" delayShow={400} className="tooltip" />
          <ReactTooltip id="customer" delayShow={400} className="tooltip" />
          <ReactTooltip id="price" delayShow={400} className="tooltip" />
        </div>
);

OrderItem.propTypes = {
  order: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleDecline: PropTypes.func.isRequired,
  handleApprove: PropTypes.func.isRequired,
  showEdit: PropTypes.bool,
  showDelete: PropTypes.bool,
  showCustomer: PropTypes.bool,
  showStatus: PropTypes.bool,
  showDecline: PropTypes.bool,
  showApprove: PropTypes.bool,
};

OrderItem.defaultProps = {
  showEdit: false,
  showDelete: false,
  showCustomer: false,
  showStatus: false,
  showDecline: false,
  showApprove: false,
};

export default OrderItem;
