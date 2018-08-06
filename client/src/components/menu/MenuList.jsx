import React from 'react';
import PropTypes from 'prop-types';
import CreateArray from 'create-array';
import ReactPaginate from 'react-paginate';
import MenuItem from './MenuItem';
import spinnerGif from '../../assets/spinner.gif';

class MenuList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowLength: 4,
      rowCount: 0,
      pageNo: 0,
      pageCount: 0,
      rows: [],
      menus: [],
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
   * loads menus for a specific page into the state
   * @param {object} paginationData
   * @param {object} props
   */
  handlePageChange(props = this.props) {
    const menus = (props.menus) ? props.menus : [];
    const perPage = (props.pagination && props.pagination.limit)
      ? props.pagination.limit : 0;
    const pageCount = (props.pagination && props.pagination.noPage)
      ? props.pagination.noPage : 0;
    const pageNo = (props.pagination && props.pagination.pageNo)
      ? props.pagination.pageNo : 0;
    const rowCount = Math.ceil((menus.length / this.state.rowLength));
    this.setState({
      pageCount,
      perPage,
      pageNo,
      menus,
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
      <div className="container">
      {!this.state.pageCount && !this.state.loading
        && <h3 className="light-text text-center">
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
          <div key={i} className="card-container">
            {this.state.menus.filter((x, j) => (j >= (i * this.state.rowLength)
            && j < ((i + 1) * this.state.rowLength)))
              .map((menu, k) => (
                <MenuItem key={k} menu={menu} />
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
MenuList.propTypes = {
  menus: PropTypes.array.isRequired,
  perPage: PropTypes.number,
  fetchData: PropTypes.func.isRequired,
};

// default props
MenuList.defaultProps = {
  perPage: 4,
};

export default MenuList;
