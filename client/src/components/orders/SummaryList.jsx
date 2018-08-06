import React from 'react';
import PropTypes from 'prop-types';
import CreateArray from 'create-array';
import ReactPaginate from 'react-paginate';
import SummaryItem from './SummaryItem';
import Display from '../common/Display';
import spinnerGif from '../../assets/spinner.gif';

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
      loading: true,
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.fetchMore = this.fetchMore.bind(this);
  }

  /* eslint-disable camelcase */
  componentDidMount() {
    this.handlePageChange();
  }

  componentWillReceiveProps(nextProps) {
    this.handlePageChange(nextProps);
  }

  /**
   * loads orders for a specific page into the state
   * @param {object} paginationData
   * @param {object} props
   */
  handlePageChange(props = this.props) {
    const summary = (props.summary) ? props.summary : [];
    const perPage = (props.pagination && props.pagination.limit)
      ? props.pagination.limit : 0;
    const pageCount = (props.pagination && props.pagination.noPage)
      ? props.pagination.noPage : 0;
    const pageNo = (props.pagination && props.pagination.pageNo)
      ? props.pagination.pageNo : 0;
    const rowCount = Math.ceil((summary.length / this.state.rowLength));
    this.setState({
      pageCount,
      perPage,
      pageNo,
      summary,
      rowCount,
      rows: CreateArray(rowCount, 'item'),
      loading: false,
    });
  }

  /**
   * calls the fetchMore function passed as props
   * to get more data
   * @param {object} paginationData
   */
  fetchMore(paginationData = { selected: 0 }) {
    this.setState({
      loading: true,
    });
    const limit = this.state.perPage;
    const offset = paginationData.selected * limit;
    this.props.fetchData(offset, limit);
  }

  render() {
    return (
      <div id="summary" className="container">
      {!this.state.loading
        && !this.state.pageCount && <h3 className="light-text text-center">
      No Records Found
      </h3>}
      {!this.state.loading
        && this.state.pageCount > 0 && <h4 className="light-text text-center">
      Page {this.state.pageNo} of {this.state.pageCount}
      </h4>}
      {this.state.loading &&
        <div className="container text-center">
          <img src={spinnerGif} alt="loading" className="spinner text-center" />
        </div>
      }
      {!this.state.loading
        && this.state.pageCount > 0 && this.state.rows.map((row, i) => (
          <div key={i} className="row container">
            {this.state.summary.filter((x, j) =>
            (j >= (i * this.state.rowLength) &&
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
                       onPageChange={this.fetchMore}
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
  fetchData: PropTypes.func.isRequired,
};

export default SummaryList;
