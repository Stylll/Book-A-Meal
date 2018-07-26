import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { isEmpty } from 'lodash';
import Main from '../Main';
import OrderList from '../orders/OrderList';
import { getOrders, saveOrder } from '../../actions/orderActions';

export class CatererPendingOrders extends React.Component {
  constructor(props) {
    super(props);

    this.declineItem = this.declineItem.bind(this);
    this.approveItem = this.approveItem.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
    this.handleApprove = this.handleApprove.bind(this);
  }

  componentDidMount() {
    this.props.actions.getOrders();
  }

  /**
   * sets the status of the order to canceled
   * @param {object} order
   */
  declineItem(order) {
    const updateOrder = {
      status: 'canceled',
      id: order.id,
    };
    this.props.actions.saveOrder(updateOrder);
  }

  /**
   * sets the status of the order to complete
   * @param {object} order
   */
  approveItem(order) {
    const updateOrder = {
      status: 'complete',
      id: order.id,
    };
    this.props.actions.saveOrder(updateOrder);
  }

  /**
   * displays a confirmation popup to confirm order decline
   * @param {object} event
   * @param {object} order
   */
  handleDecline(event, order) {
    event.preventDefault();
    confirmAlert({
      customUI: ({ onClose }) => (
          <div className="custom-ui">
            <div className="text-center">
              <img src="../../assets/error.png" alt="success" className="img-responsive img-popup" />
            </div>
            <h1 className="red-text text-center">Are you sure?</h1>
            <div className="row text-center">
                <button className="btn btn-secondary" onClick={onClose}>No, do nothing</button>
                &nbsp;&nbsp;
                { /* eslint-disable react/jsx-no-bind */}
                <button
                  className="btn btn-danger" onClick={() => {
                    this.declineItem(order);
                    onClose();
                  }}>Yes, decline it!
                </button>
            </div>
          </div>
      ),
    });
  }

  /**
   * displays a confirmation popup to confirm order approval
   * @param {object} event
   * @param {object} order
   */
  handleApprove(event, order) {
    event.preventDefault();
    confirmAlert({
      customUI: ({ onClose }) => (
          <div className="custom-ui">
            <div className="text-center">
              <img src="../../assets/error.png" alt="success" className="img-responsive img-popup" />
            </div>
            <h1 className="red-text text-center">Are you sure?</h1>
            <div className="row text-center">
                { /* eslint-disable react/jsx-no-bind */}
                <button
                  className="btn btn-secondary" onClick={() => {
                    this.approveItem(order);
                    onClose();
                  }}>Yes, approve it!
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-danger" onClick={onClose}>No, do nothing</button>
            </div>
          </div>
      ),
    });
  }

  render() {
    return (
      <Main allowCaterer>
        <div className="container text-center black-text">
          <h1 className="secondary-text-color">Pending Orders</h1>
          {/* Date Filter Box Starts */}
          <h3 className="black-text normal-text">Filter orders by date
          <form>
            <input type="date" className="datepicker textbox order-textbox" placeholder="Click here to select by date..." />
            <input type="submit" value="GO" className="btn btn-secondary" />
          </form></h3>
        </div>
        <OrderList
          orders={this.props.orders.filter(order => order.status === 'pending')}
          handleDecline={this.handleDecline}
          handleApprove={this.handleApprove}
          showApprove
          showDecline
          showCustomer
          perPage={4} />
      </Main>
    );
  }
}

// proptypes
CatererPendingOrders.propTypes = {
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
    actions: bindActionCreators({ getOrders, saveOrder }, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CatererPendingOrders);
