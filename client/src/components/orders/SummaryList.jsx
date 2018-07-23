import React from 'react';
import PropTypes from 'prop-types';
import CreateArray from 'create-array';
import ReactPaginate from 'react-paginate';
import SummaryItem from './SummaryItem';
import Display from '../common/Display';

class SummaryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowLength: 4,
      rowCount: 0,
      pageNo: 0,
      pageCount: 0,
      rows: [],
      summary: [],
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
    const { perPage, summary } = props;
    const pageCount = Math.ceil(summary.length / perPage);
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
    const summary = props.summary.filter((m, i) => i >= start && i < end);
    const rowCount = Math.ceil((summary.length / this.state.rowLength));
    this.setState({
      rowCount,
      rows: CreateArray(rowCount, 'item'),
      summary,
      pageNo: selected + 1,
    });
  }

  render() {
    return (
      <div id="summary" className="container">
      {!this.state.pageCount && <h3 className="light-text text-center">
      No Records Found
      </h3>}
      {this.state.pageCount > 0 && <h4 className="light-text text-center">
      Page {this.state.pageNo} of {this.state.pageCount}
      </h4>}
      {this.state.pageCount > 0 && this.state.rows.map((row, i) => (
          <div key={i} className="row container">
            {this.state.summary.filter((x, j) => (j >= (i * this.state.rowLength) &&
            j < ((i + 1) * this.state.rowLength)))
              .map((item, k) => (
                <SummaryItem key={k} item={item} />
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
SummaryList.propTypes = {
  summary: PropTypes.array.isRequired,
};

// default props
SummaryList.defaultProps = {
  perPage: 4,
};

export default SummaryList;
