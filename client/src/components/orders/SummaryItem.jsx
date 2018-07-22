import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { beautifyDate } from '../../utils/utils';

const SummaryItem = ({ item }) => (
  <div className="col">
    <p className="black-text bold-text">{beautifyDate(item.orderDate)}</p>
    <h4 className="black-text normal-text">Total Order:
      <span className="black-text bold-text"> {item.totalOrder}</span>
    </h4>
    <h4 className="black-text normal-text">Total Quantity:
      <span className="black-text bold-text"> {item.totalQuantity}</span>
    </h4>
    <h4 className="black-text normal-text">Total Sales:
      <span className="black-text bold-text"> &#8358;{item.totalSale}</span>
    </h4>
    <h4 className="black-text normal-text">Total Customer:
      <span className="black-text bold-text"> {item.totalCustomer}</span>
    </h4>
    <NavLink to={`/caterer/orders?date=${item.orderDate}`}>View Details</NavLink>
  </div>
);

SummaryItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default SummaryItem;
