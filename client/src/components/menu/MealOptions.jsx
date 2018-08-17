import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import CreateArray from 'create-array';
import ReactPaginate from 'react-paginate';
import debounce from 'lodash/debounce';
import MenuItem from './MenuItem';
import { getMeals } from '../../actions/mealActions';
import spinnerGif from '../../assets/spinner.gif';

export class MealOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      name: '',
      displayResult: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.findMeals = this.findMeals.bind(this);
    this.debounced = debounce(this.findMeals, 2000, { trailing: true });
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.setup = this.setup.bind(this);
  }

  /* eslint-disable no-undef */
  componentDidMount() {
    this.setup();
  }

  componentWillReceiveProps(nextProps) {
    this.setup();
  }

  /**
   * @param {null}
   * @returns {null}
   * method to set up variables needed for component to run smoothly
   */
  setup() {
    this.setState({
      loading: false,
    });
  }

  /**
   * @param {object} event
   * @returns {null}
   * method to handle input change, set value in state and loads the
   * autocomplete data
   */
  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
      displayResult: true,
      loading: true,
    });
    document.addEventListener('click', this.handleOutsideClick);
    this.debounced.cancel();
    this.debounced();
  }

  /**
   * @param {object} event
   * @returns {null}
   * method to trigger the result list when input is focused on
   */
  handleFocus(event) {
    event.preventDefault();
    this.setState({
      displayResult: true,
    });
    document.addEventListener('click', this.handleOutsideClick);
  }

  /**
   * @param {object} event
   * @returns {null}
   * updates state with selected option and calls the updateOption in the
   * parent component
   */
  handleSelect(event) {
    this.setState({
      name: event.target.innerHTML,
      displayResult: false,
    });
    document.removeEventListener('click', this.handleOutsideClick);
    const mealItem = this.props.meals
      .find(meal => meal.id === Number.parseInt(event.target.id, 10));
    this.props.updateOption(mealItem);
  }

  /**
   * @param {null}
   * @returns {null}
   * method to call get meals action passing the input value as a parameter
   */
  findMeals() {
    this.props.actions.getMeals(10, 0, this.state.name);
  }

  /**
   * @param {object} event
   * @returns {null}
   * method to handle click events outside the search dropdown div in order
   * to hide the result dropdown list
   */
  handleOutsideClick(event) {
    const div = document.getElementById('searchDropdownContainer');
    if (event.target.parentNode.contains(div)) {
      this.setState({
        displayResult: false,
      });
      document.removeEventListener('click', this.handleOutsideClick);
    }
  }

  render() {
    return (
      <div id="searchDropdownContainer" className="searchDropdownContainer">
      <div>
        <input name="name"
          type="text"
          onFocus={this.handleFocus}
          onChange={this.handleChange}
          value={this.state.name}
          placeholder="Search for meal by name..."
          autoComplete="off" />
        {this.state.loading &&
          <img src={spinnerGif} alt="loading" className="spinner" />
        }
        {this.state.displayResult &&
          !this.state.loading && this.props.meals.length > 0 &&
          <div className="result">
            {this.props.meals.map(meal => (
              <div key={meal.id} id={meal.id} className="item"
                onClick={this.handleSelect}>
                {meal.name}
              </div>
            ))}
          </div>
        }
      </div>
      </div>
    );
  }
}

// proptypes
MealOptions.propTypes = {
  actions: PropTypes.object.isRequired,
  meals: PropTypes.array.isRequired,
  updateOption: PropTypes.func.isRequired,
};

/**
 * Maps a portion of the state to props for access
 * @param {object} state
 * @returns {object} props retrieved from state
 */
const mapStateToProps = state => (
  {
    meals: state.meals.meals,
  }
);

/**
 * Maps actions for component
 * @param {function} dispatch
 * @returns {object} actions retrieved from redux actions
 */
const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators({ getMeals }, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(MealOptions);
