import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Main from '../Main';
import TextInput from '../common/TextInput';
import { validateSigninInput } from '../../utils/validateInput';
import { signin } from '../../actions/authActions';

export class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValid = this.isValid.bind(this);
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
    const { isValid, errors } = validateSigninInput(this.state);
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
    if (this.isValid()) {
      this.props.actions.signin(this.state)
        .then((resp) => {
          this.setState({
            errors: this.props.errors,
          });
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
      <Main>
        <div className="signin-overall">
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
          <div className="signin-content">
            <div className="container text-center">
              <h1 className="black-text bold-text">Sign In to your account</h1>
            </div>
            <div className="container">
              <div className="text-center">
              {this.state.errors.message && <span className="red-text error">
              {this.state.errors.message}
              </span>}
              </div>
                <div>
                  <h4 className="black-text light-text">Email</h4>
                  <TextInput
                    name="email"
                    type="text"
                    value={this.state.email}
                    required
                    className="textbox"
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
                    className="textbox"
                    placeholder="Enter password here..."
                    onChange={this.handleChange}
                    error={this.state.errors.password}
                    />
                </div>
                <div className="container text-right">
                <NavLink to="/users/forgotpassword" className="secondary-text-color light-text">
                  forgot password ?
                  </NavLink>
                 </div>
                <br /><br />
                <div className="container text-center">
                  <input type="button" onClick={this.handleSubmit} className="btn btn-secondary" value="Sign In" />
                </div>
                <br />
                <div className="container text-center">
                  <NavLink to="/users/signup" className="secondary-text-color">
                  Don't have an account ?. Sign Up
                  </NavLink>
                </div>
                <br />
            </div>
          </div>

        </div>

      </Main>
    );
  }
}

// proptypes
Signin.propTypes = {
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
    actions: bindActionCreators({ signin }, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Signin);