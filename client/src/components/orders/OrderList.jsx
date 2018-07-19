import React from 'react';
import PropTypes from 'prop-types';
import CreateArray from 'create-array';
import ReactPaginate from 'react-paginate';
import OrderItem from './OrderItem';
import Display from '../common/Display';

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowLength: 4,
      rowCount: 0,
      pageNo: 0,
      pageCount: 0,
      rows: [],
      orders: [],
    };

    this.initializeState = this.initializeState.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  /* eslint-disable camelcase */
  componentDidMount() {
    this.initializeState();
    this.handlePageChange();
  }

  componentWillReceiveProps(nextProps) {
    this.initializeState(nextProps);
    this.handlePageChange({ selected: 0 }, nextProps);
  }

  /**
   * initializes state with necessary values.
   * @param {object} prop
   * Adds perPage value to state.
   * Adds pageCount value to state.
   */
  initializeState(props = this.props) {
    const { perPage, orders } = props;
    const pageCount = Math.ceil(orders.length / perPage);
    this.setState({
      pageCount,
    });
  }

  /**
   * loads orders for a specific page into the state
   * @param {object} paginationData
   * @param {object} props
   */
  handlePageChange(paginationData = { selected: 0 }, props = this.props) {
    const { selected } = paginationData;
    const start = selected * props.perPage;
    const end = (selected + 1) * props.perPage;
    const orders = props.orders.filter((m, i) => i >= start && i < end);
    const rowCount = Math.ceil((orders.length / this.state.rowLength));
    this.setState({
      rowCount,
      rows: CreateArray(rowCount, 'item'),
      orders,
      pageNo: selected + 1,
    });
    /* eslint-disable no-undef */
    window.scrollTo(0, 100);
  }

  render() {
    return (
      <div className="container">
      {!this.state.pageCount && <h3 className="light-text text-center">
      No Records Found
      </h3>}
      {this.state.pageCount > 0 && <h4 className="light-text text-center">
      Page {this.state.pageNo} of {this.state.pageCount}
      </h4>}
      {this.state.pageCount > 0 && this.state.rows.map((row, i) => (
          <div key={i} className="card-container">
            {this.state.orders.filter((x, j) => (j >= (i * this.state.rowLength) &&
            j < ((i + 1) * this.state.rowLength)))
              .map((order, k) => (
                <OrderItem key={k} order={order}
                  handleDelete={this.props.handleDelete}
                  showEdit={this.props.showEdit}
                  showDelete={this.props.showDelete}
                  showCustomer={this.props.showCustomer}
                  showStatus={this.props.showStatus} />
              ))}
          </div>
        ))}

        {this.state.pageCount > 0 &&
        <ReactPaginate previousLabel={'<'}
                       nextLabel={'>'}
                       breakLabel={<a href="">...</a>}
                       breakClassName={'break-me'}
                       pageCount={this.state.pageCount}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       onPageChange={this.handlePageChange}
                       containerClassName={'pagination'}
                       subContainerClassName={''}
                       activeClassName={'active'} />
      }
      </div>
    );
  }
}

// prop-types
OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
  handleDelete: PropTypes.func,
  perPage: PropTypes.number,
  showEdit: PropTypes.bool,
  showDelete: PropTypes.bool,
  showCustomer: PropTypes.bool,
  showStatus: PropTypes.bool,
};

// default props
OrderList.defaultProps = {
  perPage: 4,
  handleDelete: () => Promise.resolve(),
  showEdit: false,
  showDelete: false,
  showCustomer: false,
  showStatus: false,
};

export default OrderList;
