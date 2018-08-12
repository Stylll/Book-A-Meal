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
const OrderRow = ({
  sn, order, handleDelete, showEdit, showDelete, showCustomer, showStatus,
  handleApprove, handleDecline, showApprove, showDecline,
}) => (
  <tr>
            <td className="wrap-text">{sn}</td>
            <td className="orderId wrap-text">{order.id}</td>
            <td data-for="title"
                data-tip={order.meal.name}
                className="meal-title wrap-text">
                {order.meal.name}
            </td>
            <td data-for="price"
                data-tip={order.price}
                className="price wrap-text">
                {order.price}
            </td>
            <td className="quantity wrap-text">{order.quantity}</td>
            <td data-for="cost"
                data-tip={order.cost}
                className="cost wrap-text">{order.cost}</td>
            {showCustomer &&
            <td data-for="customer"
                data-tip={order.user.username}
                className="customer wrap-text">
                {order.user.username}
            </td>
            }
            {showStatus &&
            <td data-for="status"
                data-tip={order.status}
                className="status wrap-text">{order.status}</td>
            }
            <td className="orderdate wrap-text">
            {beautifyDate(order.createdAt)}</td>
            {showEdit &&
            <td className="edit"><NavLink to={`/customer/orders/edit/${order.id}`}>
            Edit
            </NavLink></td>}
            { /* eslint-disable react/jsx-no-bind */}
            {showDelete &&
            <td className="delete"><a href="" onClick={e => handleDelete(e, order)}>
            Cancel
            </a></td>}
            {showApprove &&
            <td className="approve">
              <a href="" onClick={e => handleApprove(e, order)}>Approve</a>
            </td>}
            {showDecline &&
            <td className="decline">
              <a href="" onClick={e => handleDecline(e, order)}>
              Decline</a>
            </td>}
            <ReactTooltip id="title" delayShow={400} className="tooltip" />
            <ReactTooltip id="customer" delayShow={400} className="tooltip" />
            <ReactTooltip id="price" delayShow={400} className="tooltip" />
            <ReactTooltip id="cost" delayShow={400} className="tooltip" />
            <ReactTooltip id="status" delayShow={400} className="tooltip" />
        </tr>
);

OrderRow.propTypes = {
  sn: PropTypes.number.isRequired,
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

OrderRow.defaultProps = {
  showEdit: false,
  showDelete: false,
  showCustomer: false,
  showStatus: false,
  showDecline: false,
  showApprove: false,
};

export default OrderRow;
