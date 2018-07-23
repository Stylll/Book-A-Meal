import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Main from '../Main';
import { saveMenu } from '../../actions/menuActions';
import { validateMenuInput } from '../../utils/validateInput';

export class EditMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      mealIds: [],
      mealOption: null,
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.isValid = this.isValid.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateOption = this.updateOption.bind(this);
    this.removeMeal = this.removeMeal.bind(this);
    this.setup = this.setup.bind(this);
  }

  /**
   * this is called after the component is mounted
   */
  componentDidMount() {
    this.setup(this.props.menus);
  }

  /**
   * this is called when the component is about to receive new props
   * @param {object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    this.setup(nextProps.menus);
  }

  /**
   * class method to load menu into state if it exists.
   * @param {array} menus
   * uses the id provided in the url to find a matching menu.
   * then updates the state with the records.
   */
  setup(menus) {
    const { id } = this.props.match.params;
    if (id && menus.length > 0) {
      const menu = menus.find(m => m.id === Number.parseInt(id, 10));
      /**
       * get only the meals created by the caterer from the menu since we don't want a caterer
       * to be able to delete another caterer's meal from the menu
      */
      const createdMealIdsInMenu = this.props.meals.filter(m => menu.mealIds.includes(m.id))
        .map(meal => meal.id);
      if (menu) {
        this.setState({
          id: menu.id,
          mealIds: createdMealIdsInMenu,
        });
      }
    }
  }

  /**
   * method to add meals to the meal array in the state
   * @param {object} event
   */
  handleAdd(event) {
    event.preventDefault();
    if (this.state.mealOption && !this.state.mealIds.includes(this.state.mealOption)) {
      const newMealIds = [...this.state.mealIds];
      newMealIds.push(this.state.mealOption);
      this.setState({
        mealIds: newMealIds,
      });
    }
  }

  /**
   * method to remove meal item from a menu
   * @param {object} event
   */
  removeMeal(event) {
    event.preventDefault();
    const mealId = parseInt(event.target.id, 10);
    this.setState({
      mealIds: this.state.mealIds.filter(id => id !== mealId),
    });
  }

  /**
   * method to update the selected option in the state
   * @param {object} event
   */
  updateOption(event) {
    event.preventDefault();
    if (event.target.value) {
      this.setState({
        [event.target.name]: parseInt(event.target.value, 10),
      });
    }
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
  handleSubmit(event) {
    if (this.isValid()) {
      const menuDetails = {
        id: this.state.id || null,
        mealIds: [...this.state.mealIds],
      };
      this.props.actions.saveMenu(menuDetails)
        .then(() => {
          if (isEmpty(this.props.errors)) {
            this.props.history.push('/caterer/menus');
          } else {
            this.setState({
              errors: this.props.errors,
            });
          }
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
    <div className="container text-center black-text">
      <h2 className="black-text bold-text">Menu for Today</h2>
        {this.state.errors.menu
          && <span className="red-text errors" id="mealOption-error">{this.state.errors.menu}</span>}
        <div>
          <p>Selected Options: ({this.state.mealIds.length})</p>
          <div className="meal-options">
            {this.state.mealIds.map(id => (
                <div key={id}>
                {this.props.meals.find(meal => meal.id === id) &&
                <span>{this.props.meals.find(meal => meal.id === id).name}</span>} &nbsp; &nbsp;
                <input id={id} type="button" onClick={this.removeMeal} className="btn btn-danger pull-right" value="Remove" />
                <br /><br /><br />
                </div>
              ))}
          </div>
        </div>
          <div>
            <h3 className="black-text light-text">Meal Options</h3>
            {this.state.errors.mealIds
              && <span className="red-text errors" id="mealOption-error">{this.state.errors.mealIds}</span>}
            <select name="mealOption" className="select" onChange={this.updateOption}>
            <option>Select a meal</option>
              {this.props.meals.map(meal => (
                  <option key={meal.id} value={meal.id}>{meal.name}</option>
                ))}
            </select>
          </div>
          <br />
          <div>
            <input type="button" className="btn btn-secondary" onClick={this.handleAdd} value="Add to Menu" />
            &nbsp; &nbsp;
            <input type="button" className="btn btn-secondary" onClick={this.handleSubmit} value="Save" />
            &nbsp; &nbsp;
            <NavLink to="/caterer/menus" className="btn btn-danger">Cancel</NavLink>
          </div>
        <br /><br />

    </div>
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
  menus: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
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
    menus: state.menus.menus,

  }
);

/**
 * Maps actions for component
 * @param {function} dispatch
 * @returns {object} actions retrieved from redux actions
 */
const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators({ saveMenu }, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EditMenu);