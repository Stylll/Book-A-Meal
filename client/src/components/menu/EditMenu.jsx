import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import ReactPaginate from 'react-paginate';
import Main from '../Main';
import MealOptions from './MealOptions';
import { saveMenu, getMenuById } from '../../actions/menuActions';
import { validateMenuInput } from '../../utils/validateInput';
import spinnerGif from '../../assets/spinner.gif';

export class EditMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      id: 0,
      errors: {},
      mealIds: [],
      loading: true,
      pageNo: 0,
      pageCount: 0,
      meals: [],
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.isValid = this.isValid.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateOption = this.updateOption.bind(this);
    this.removeMeal = this.removeMeal.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  /**
   * this is called after the component is mounted
   * it fetchs the menu data to be rendered in the page
   */
  componentDidMount() {
    this.fetchData();
  }

  /**
   * this is called when the component is about to receive new props
   * @param {object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params && nextProps.match.params.id) {
      this.handlePageChange(nextProps);
    }
  }

  /**
   * @param {object} props
   * loads specific menu into the state
   */
  handlePageChange(props = this.props) {
    const menu = (props.menu) ? props.menu : {};
    menu.meals = (props.menu.meals) ? props.menu.meals : [];
    const perPage = (props.pagination && props.pagination.limit)
      ? props.pagination.limit : 0;
    const pageCount = (props.pagination && props.pagination.noPage)
      ? props.pagination.noPage : 0;
    const pageNo = (props.pagination && props.pagination.pageNo)
      ? props.pagination.pageNo : 0;
    const totalCount = (props.pagination && props.pagination.totalCount)
      ? props.pagination.totalCount : 0;
    const rowCount = Math.ceil((menu.meals.length / this.state.rowLength));
    const mealIds = menu.mealIds || [];
    this.setState({
      pageCount,
      perPage,
      pageNo,
      menu,
      mealIds,
      meals: menu.meals,
      loading: false,
      totalCount,
      mealOption: {},
    });
  }

  /**
   * method to add meals to the meal array in the state
   * @param {object} event
   */
  handleAdd(event) {
    if (!isEmpty(this.state.mealOption)) {
      const newIds = [...this.state.mealIds, this.state.mealOption.id];
      this.setState({
        mealIds: newIds,
      }, this.handleSubmit);
    }
  }

  /**
   * method to remove meal item from a menu
   * @param {object} event
   */
  removeMeal(event) {
    event.preventDefault();
    const mealId = parseInt(event.target.id, 10);
    const newIds = this.state.mealIds.filter(id => id !== mealId);
    this.setState({
      mealIds: newIds,
    }, this.handleSubmit);
  }

  /**
   * method to update the selected option in the state
   * @param {object} event
   */
  updateOption(meal) {
    this.setState({
      mealOption: meal,
    });
  }

  /**
   * method to validate menu input
   * @param {object} event
   * @returns {boolean} isValid
   */
  isValid(event) {
    const { isValid, errors } = validateMenuInput(this.state);
    this.setState({
      errors,
    });
    return isValid;
  }

  /**
   * method to submit form to api.
   * calls saveMenu action if form is valid.
   * @param {object} event
   */
  handleSubmit(newIds) {
    this.setState({
      loading: true,
    });
    if (this.isValid()) {
      const menuDetails = {
        id: this.state.id || null,
        mealIds: [...this.state.mealIds],
      };
      this.props.actions.saveMenu(menuDetails)
        .then(() => {
          if (isEmpty(this.props.errors)) {
            if (!this.state.id) {
              this.props.history.push('/caterer/menus');
            }
            this.fetchData();
          } else {
            this.setState({
              errors: this.props.errors,
              loading: false,
            });
          }
        });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  /**
   * method to call action to fetch data from the server
   * it then updates the state
   * @param object - pagination data
   */
  fetchData(paginationData = { selected: 0 }) {
    const { id } = this.props.match.params;
    if (id) {
      this.setState({
        loading: true,
        id,
      });
      const limit = this.state.perPage || 10;
      const offset = paginationData.selected * limit;
      this.props.actions.getMenuById(id, limit, offset);
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    return (
      <Main allowCaterer>
        {/* Header Content Start */ }
    <div className="container">
        <h1 className="secondary-text-color text-center">Add Meals to Menu</h1>
    </div>
    {/* Header Content Ends */ }
    {/* Form Content Start */ }
    <div className="container text-center black-text menu-form">
      <h2 className="black-text bold-text">
        {this.props.menu.name || 'Menu For Today'}
      </h2>
      <MealOptions updateOption={this.updateOption} />
      <br />
      {this.state.loading &&
        <img src={spinnerGif} alt="loading" className="spinner" />
      }
      {!this.state.loading &&
        <div>
          <input type="button" className="btn btn-secondary" onClick={this.handleAdd} value="Add to Menu" />
            &nbsp; &nbsp;
            <NavLink to="/caterer/menus" className="btn btn-danger"><span>Cancel</span></NavLink>
        </div>
      }
        {this.state.errors.menu
          && <span className="red-text errors" id="mealOption-error">{this.state.errors.menu}</span>}
          {this.state.errors.mealIds
          && <span className="red-text errors" id="mealOption-error">{this.state.errors.mealIds}</span>}
        {this.state.meals.length > 0 &&
          <div>
            <p>Selected Options: ({this.state.totalCount})</p>
            <div className="meal-options">
              {this.state.meals.map(meal => (
                  <div key={meal.id}>
                    <span>{meal.name}</span> &nbsp; &nbsp;
                    <input id={meal.id} type="button" onClick={this.removeMeal}
                      className="btn btn-danger pull-right" value="Remove" />
                    <br /><br /><br />
                  </div>
                ))}
            </div>
            {this.state.pageCount > 0 &&
            <ReactPaginate previousLabel={'<'}
                          nextLabel={'>'}
                          breakLabel={<a href="">...</a>}
                          breakClassName={'break-me'}
                          pageCount={this.state.pageCount}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={this.fetchData}
                          containerClassName={'pagination'}
                          subContainerClassName={''}
                          activeClassName={'active'} />
            }
          </div>
        }
    </div>
    <br />
    {/* Form Content Ends */ }
      </Main>
    );
  }
}

// proptypes
EditMenu.propTypes = {
  actions: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  meals: PropTypes.array.isRequired,
  menu: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
};

/**
 * Maps a portion of the state to props for access
 * @param {object} state
 * @returns {object} props retrieved from state
 */
const mapStateToProps = state => (
  {
    errors: state.menus.errors,
    meals: state.meals.meals,
    menu: state.menus.menu,
    pagination: state.menus.pagination,
  }
);

/**
 * Maps actions for component
 * @param {function} dispatch
 * @returns {object} actions retrieved from redux actions
 */
const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators({ saveMenu, getMenuById }, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EditMenu);
