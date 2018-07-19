import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Main from '../Main';
import OrderList from '../orders/OrderList';
import { getOrders, deleteOrder } from '../../actions/orderActions';

export class ViewOrders extends React.Component {
  constructor(props) {
    super(props);

    this.deleteItem = this.deleteItem.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.props.actions.getOrders();
  }

  deleteItem(orderId) {
    this.props.actions.deleteOrder(orderId);
  }

  handleDelete(event, orderId) {
    event.preventDefault();
    /* eslint-disable no-undef */

    confirmAlert({
      customUI: ({ onClose }) => (
          <div className="custom-ui">
            <div className="text-center">
              <img src="../../assets/error.png" alt="success" className="img-responsive img-popup" />
            </div>
            <h1 className="red-text text-center">Are you sure?</h1>
            <div className="row text-center">
                <button className="btn btn-secondary" onClick={onClose}>No</button>
                &nbsp;&nbsp;
                { /* eslint-disable react/jsx-no-bind */}
                <button
                  className="btn btn-danger" onClick={() => {
                    this.deleteItem(orderId);
                    onClose();
                  }}>Yes, Delete it!
                </button>
            </div>
          </div>
      ),
    });
  }

  render() {
    return (
      <Main allowCustomer>
        <div className="container text-center black-text">
          <h1 className="secondary-text-color">My Order History</h1>
          {/* Date Filter Box Starts */}
          <h3 className="black-text normal-text">Filter orders by date
          <form>
            <input type="text" className="datepicker textbox order-textbox" placeholder="Click here to select by date..." />
            <input type="submit" value="GO" className="btn btn-secondary" />
          </form></h3>
        </div>
        <OrderList
          orders={this.props.orders}
          handleDelete={this.handleDelete}
          showStatus
          perPage={8} />
      </Main>
    );
  }
}

// proptypes
ViewOrders.propTypes = {
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
    errors: state.orders.customerOrders.errors,
    orders: state.orders.customerOrders.orders,
  }
);

/**
 * Maps actions for component
 * @param {function} dispatch
 * @returns {object} actions retrieved from redux actions
 */
const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators({ getOrders, deleteOrder }, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(ViewOrders);
