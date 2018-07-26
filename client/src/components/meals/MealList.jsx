import React from 'react';
import PropTypes from 'prop-types';
import CreateArray from 'create-array';
import ReactPaginate from 'react-paginate';
import MealItem from './MealItem';
import Display from '../common/Display';

class MealList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowLength: 4,
      rowCount: 0,
      pageNo: 0,
      pageCount: 0,
      rows: [],
      meals: [],
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
    const { perPage, meals } = props;
    const pageCount = Math.ceil(meals.length / perPage);
    this.setState({
      pageCount,
    });
  }

  /**
   * loads meals for a specific page into the state
   * @param {object} paginationData
   * @param {object} props
   */
  handlePageChange(paginationData = { selected: 0 }, props = this.props) {
    const { selected } = paginationData;
    const start = selected * props.perPage;
    const end = (selected + 1) * props.perPage;
    const meals = props.meals.filter((m, i) => i >= start && i < end);
    const rowCount = Math.ceil((meals.length / this.state.rowLength));
    this.setState({
      rowCount,
      rows: CreateArray(rowCount, 'item'),
      meals,
      pageNo: selected + 1,
    });
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
            {this.state.meals.filter((x, j) => (j >= (i * this.state.rowLength) &&
            j < ((i + 1) * this.state.rowLength)))
              .map((meal, k) => (
                <MealItem key={k} meal={meal}
                  handleDelete={this.props.handleDelete}
                  showEdit={this.props.showEdit}
                  showDelete={this.props.showDelete}
                  showOrder={this.props.showOrder} />
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
MealList.propTypes = {
  meals: PropTypes.array.isRequired,
  handleDelete: PropTypes.func,
  perPage: PropTypes.number,
  showEdit: PropTypes.bool.isRequired,
  showDelete: PropTypes.bool.isRequired,
  showOrder: PropTypes.bool,
};

// default props
MealList.defaultProps = {
  perPage: 4,
  handleDelete: () => Promise.resolve(),
  showOrder: false,
};

export default MealList;
