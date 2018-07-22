import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Main from '../Main';
import SummaryList from '../orders/SummaryList';
import { getOrderSummary } from '../../actions/orderActions';

export class OrderSummary extends React.Component {
  componentDidMount() {
    this.props.actions.getOrderSummary();
  }

  render() {
    return (
      <Main allowCaterer>
        <div className="container text-center black-text">
          <h1 className="secondary-text-color">Customer Order Summary</h1>
          {/* Date Filter Box Starts */}
          <h3 className="black-text normal-text">Filter orders by date
          <form>
            <input type="date" className="datepicker textbox order-textbox" placeholder="Click here to select by date..." />
            <input type="submit" value="GO" className="btn btn-secondary" />
          </form></h3>
        </div>
        <SummaryList
          summary={this.props.summary}
          perPage={4} />
      </Main>
    );
  }
}

// proptypes
OrderSummary.propTypes = {
  actions: PropTypes.object.isRequired,
  summary: PropTypes.array.isRequired,
};

/**
 * Maps a portion of the state to props for access
 * @param {object} state
 * @returns {object} props retrieved from state
 */
const mapStateToProps = state => (
  {
    summary: state.orders.catererOrders.summary,
  }
);

/**
 * Maps actions for component
 * @param {function} dispatch
 * @returns {object} actions retrieved from redux actions
 */
const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators({ getOrderSummary }, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);
