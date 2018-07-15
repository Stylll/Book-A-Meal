import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Main from '../Main';
import TextInput from '../common/TextInput';
import { validateMealInput } from '../../utils/validateInput';
import { saveMeal } from '../../actions/mealActions';

export class EditMeal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      price: '',
      errors: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValid = this.isValid.bind(this);
    this.setup = this.setup.bind(this);
  }

  componentDidMount() {
    this.setup(this.props.meals);
  }

  componentWillReceiveProps(nextProps) {
    this.setup(nextProps.meals);
  }

  /**
   * class method to load meal details into state if it exists.
   * @param {array} meals
   * uses the id provided in the url to find a matching meal.
   * then updates the state with the records.
   */
  setup(meals) {
    const { id } = this.props.match.params;
    if (id && meals.length > 0) {
      const meal = meals.find(x => x.id === Number.parseInt(id, 10));
      if (meal) {
        this.setState({
          id: meal.id,
          name: meal.name,
          price: meal.price.toString(),
        });
      }
    }
  }

  /**
   * method to handle element changes.
   * @param {object} event
   * updates the state with event value.
   */
  handleChange(event) {
    event.preventDefault();
    if (event.target.name === 'imageUpload') {
      this.setState({
        [event.target.name]: event.target.files[0],
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  }

  /**
   * method to validate save meal form.
   * updates the state with error object if any
   * @returns {bool} isValid
   */
  isValid() {
    const { isValid, errors } = validateMealInput(this.state);
    this.setState({
      errors,
    });
    return isValid;
  }

  /**
   * method to submit form to api.
   * calls saveMeal action if form is valid.
   * @param {object} event
   */
  handleSubmit(event) {
    event.preventDefault();
    if (this.isValid()) {
      this.props.actions.saveMeal(this.state)
        .then(() => {
          if (isEmpty(this.props.errors)) {
            this.props.history.push('/caterer/meals');
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
        {/* <!-- Header Content Start --> */}
        <div className="container">
          <h1 className="secondary-text-color text-center">Add / Edit Meal</h1>
        </div>
        {/* <!-- Header Content Ends --> */}
        {/* <!-- Form Content Starts --> */}
        <div className="container text-center">
            <div>
              <h3 className="black-text bold-text">Meal Name</h3>
              <TextInput
                  name="name"
                  type="text"
                  value={this.state.name}
                  required
                  className="meal-textbox textbox"
                  placeholder="Enter meal name..."
                  onChange={this.handleChange}
                  error={this.state.errors.name}
                  />
            </div>
            <div>
              <h3 className="black-text bold-text">Meal Price &#8358;</h3>
              <TextInput
                  name="price"
                  type="number"
                  value={this.state.price}
                  required
                  className="meal-textbox textbox"
                  placeholder="Enter meal price..."
                  onChange={this.handleChange}
                  error={this.state.errors.price}
                  />
            </div>
            <div>
              <h3 className="black-text bold-text">Upload Image</h3>
              <input type="file" name="imageUpload" className="meal-textbox textbox" onChange={this.handleChange} />
            </div>
            <br /><br />
            <div>
              <input type="button" onClick={this.handleSubmit} className="btn btn-secondary" value="Save" />
              &nbsp;&nbsp;
              <NavLink to="/caterer/meals">Cancel</NavLink>
            </div>
        </div>
        {/* <!-- Form Content Ends --> */}

      </Main>
    );
  }
}

// proptypes
EditMeal.propTypes = {
  actions: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  meals: PropTypes.array.isRequired,
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
    errors: state.meals.errors,
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
    actions: bindActionCreators({ saveMeal }, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EditMeal);
