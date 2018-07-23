import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Main from '../Main';
import OrderList from '../orders/OrderList';
import { getOrders, deleteOrder } from '../../actions/orderActions';

export class CatererViewOrders extends React.Component {
  componentDidMount() {
    this.props.actions.getOrders();
  }

  render() {
    return (
      <Main allowCaterer>
        <div className="container text-center black-text">
          <h1 className="secondary-text-color">Customer Order History</h1>
          {/* Date Filter Box Starts */}
          <h3 className="black-text normal-text">Filter orders by date
          <form>
            <input type="date" className="datepicker textbox order-textbox" placeholder="Click here to select by date..." />
            <input type="submit" value="GO" className="btn btn-secondary" />
          </form></h3>
        </div>
        <OrderList
          orders={this.props.orders}
          showStatus
          showCustomer
          perPage={8} />
      </Main>
    );
  }
}

// proptypes
CatererViewOrders.propTypes = {
  actions: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  orders: PropTypes.array.isRequired,
};

/**
 * Maps a portion of the state to props for access
 * @param {object} state
 * @returns {object} props retrieved from state
 */
const mapStateToProps = state => (
  {
    errors: state.orders.catererOrders.errors,
    orders: state.orders.catererOrders.orders,
  }
);

/**
 * Maps actions for component
 * @param {function} dispatch
 * @returns {object} actions retrieved from redux actions
 */
const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators({ getOrders }, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CatererViewOrders);
