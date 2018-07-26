import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Main from '../Main';
import TextInput from '../common/TextInput';
import { validateSignupInput } from '../../utils/validateInput';
import { signup } from '../../actions/authActions';
import spinnerGif from '../../assets/spinner.gif';

export class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      accountType: 'customer',
      errors: {},
      loading: false,
    };

    // bind class methods
    this.handleChange = this.handleChange.bind(this);
    this.isValid = this.isValid.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * method to handle element changes.
   * @param {object} event
   * updates the state with event value.
   */
  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  /**
   * method to validate signup form.
   * updates the state with error object if any
   * @returns {bool} isValid
   */
  isValid() {
    const { isValid, errors } = validateSignupInput(this.state);
    this.setState({
      errors,
    });
    return isValid;
  }

  /**
   * method to submit form to api.
   * calls signup action if form is valid.
   * @param {object} event
   */
  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    if (this.isValid()) {
      this.props.actions.signup(this.state)
        .then((resp) => {
          this.setState({
            errors: this.props.errors,
            loading: false,
          });
        });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    if (this.props.isAuthenticated && this.props.isCaterer) {
      return (
        <Redirect to="/caterer/meals" />
      );
    }
    if (this.props.isAuthenticated) {
      return (
        <Redirect to="/customer/orders" />
      );
    }
    return (
      <Main allowAnonymous>
        { /* Content starts */}
        <div className="overall">
          <div className="intro">
            <div className="intro-content">
              <div className="container white-text title text-center">
                Book-A-Meal
          </div>
              <div className="container white-text text-center">
                <h2>Book a meal in 3 easy steps:</h2>
                <div className="list-container">
                  <ol className="list-steps">
                    <li>Create an Account</li>
                    <li>Sign in to your account</li>
                    <li>Order for any meal on the menu</li>
                  </ol>
                </div>
                <p>Simple as reading A, B, C. right ?</p>
              </div>
            </div>

          </div>
          <div className="signup-content">
            <div className="container text-center">
              <h1 className="black-text bold-text">Create an account</h1>
            </div>
            <div className="container">
                <div>
                  <h4 className="black-text light-text">Username</h4>
                  <TextInput
                    name="username"
                    type="text"
                    value={this.state.username}
                    required
                    className="signup-textbox textbox"
                    placeholder="Enter username here..."
                    onChange={this.handleChange}
                    error={this.state.errors.username}
                    />
                </div>
                <div>
                  <h4 className="black-text light-text">Email</h4>
                  <TextInput
                    name="email"
                    type="text"
                    value={this.state.email}
                    required
                    className="signup-textbox textbox"
                    placeholder="Enter email here..."
                    onChange={this.handleChange}
                    error={this.state.errors.email}
                    />
                </div>
                <div>
                  <h4 className="black-text light-text">Password</h4>
                  <TextInput
                    name="password"
                    type="password"
                    value={this.state.password}
                    required
                    className="signup-textbox textbox"
                    placeholder="Enter password here..."
                    onChange={this.handleChange}
                    error={this.state.errors.password}
                    />
                </div>
                <div>
                  <h4 className="black-text light-text">Confirm Password</h4>
                  <TextInput
                    name="confirmPassword"
                    type="password"
                    value={this.state.confirmPassword}
                    required
                    className="signup-textbox textbox"
                    placeholder="Enter password again..."
                    onChange={this.handleChange}
                    error={this.state.errors.confirmPassword}
                    />
                </div>
                <div>
                  <h4 className="black-text light-text">Account Type</h4>
                  <select name="accountType" onChange={this.handleChange} value={this.state.accountType}
                    className="signup-select" required>
                    <option value="customer">Customer</option>
                    <option value="caterer">Caterer</option>
                  </select>
                  {this.state.errors.accountType && <span className="red-text errors" id="at-error">
                  {this.state.errors.accountType}
                  </span>}
                </div>
                <br />
                <br />
                <div className="container text-center">
                  {this.state.loading &&
                    <img src={spinnerGif} alt="loading" className="spinner text-center" />
                  }
                  {!this.state.loading &&
                  <input type="button" onClick={this.handleSubmit} className="btn btn-secondary" value="Sign Up" />
                  }
                </div>

                <br />
                <div className="container text-center">
                <NavLink to="/users/signin" className="secondary-text-color">
                  Have an account ?. Sign In
                </NavLink>
                </div>
                <br />
            </div>
          </div>

        </div>
        { /* Content Ends */}
      </Main>
    );
  }
}

// proptypes
Signup.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isCaterer: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

/**
 * Maps a portion of the state to props for access
 * @param {object} state
 * @returns {object} props retrieved from state
 */
const mapStateToProps = state => (
  {
    isAuthenticated: state.auth.isAuthenticated,
    isCaterer: state.auth.isCaterer,
    errors: state.auth.errors,
  }
);

/**
 * Maps actions for component
 * @param {function} dispatch
 * @returns {object} actions retrieved from redux actions
 */
const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators({ signup }, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
