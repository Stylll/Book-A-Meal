import 'babel-polyfill';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import LoadingBar from 'react-redux-loading-bar';
import { Redirect } from 'react-router-dom';
import NavBar from './common/NavBar';
import { logout } from '../actions/authActions';

/* eslint-disable no-useless-constructor */
export class Main extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.expandNav = this.expandNav.bind(this);
    this.toggleNav = this.toggleNav.bind(this);
  }

  /**
   * method to handle session logout.
   * @param {object} event
   */
  logout(event) {
    event.preventDefault();
    this.props.actions.logout();
  }

  /**
   * method to toggle the navbar on small screen
   * @param {object} event
   */
  expandNav(event) {
    event.preventDefault();
    /* eslint-disable no-undef */
    const nav = document.getElementsByTagName('nav')[0];
    if (nav.className.indexOf('responsive') === -1) {
      nav.className += ' responsive';
    } else {
      const index = nav.className.indexOf('responsive');
      nav.className = nav.className.substring(0, index);
    }
  }

  /**
   * method to toggle dropdown menu for navigation link
   * @param {object} event
   */
  toggleNav(event) {
    event.preventDefault();
    const item = event.target.nextElementSibling;
    if (item.className.indexOf('show') === -1) {
      item.className = `${item.className} show`;
    } else {
      item.className = 'dropdown-content';
    }
  }

  render() {
    /**
     * Restricts user from accessing page if user is not authenticated
     */
    if (!this.props.allowAnonymous) {
      if (!this.props.isAuthenticated) {
        return (
          <Redirect to="/users/signin" />
        );
      }
    }

    /**
     * Restricts caterers from accessing page if caterer is not allowed
     */
    if (!this.props.allowCaterer) {
      if (this.props.isCaterer) {
        return (
          <Redirect to="/unauthorized" />
        );
      }
    }

    /**
     * Restricts customer from accessing page if customer is not allowed
     */
    if (!this.props.allowCustomer) {
      if (!this.props.isCaterer && this.props.isAuthenticated) {
        return (
          <Redirect to="/unauthorized" />
        );
      }
    }

    /**
     * Handles output rendered by the component.
     * @returns {jsx} form of the component.
     */
    return (
      <div className="">
        <LoadingBar className="loadingBar" />
        <NavBar user={this.props.user} isAuthenticated={this.props.isAuthenticated}
          isCaterer={this.props.isCaterer} logout={this.logout} expandNav={this.expandNav}
          toggleNav={this.toggleNav}
        />
        {this.props.children}
      </div>
    );
  }
}

// proptypes
/* eslint-disable react/forbid-prop-types */
Main.propTypes = {
  children: PropTypes.any.isRequired,
  user: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isCaterer: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
  allowAnonymous: PropTypes.bool,
  allowCaterer: PropTypes.bool,
  allowCustomer: PropTypes.bool,
};

// default props
Main.defaultProps = {
  allowAnonymous: false,
  allowCaterer: false,
  allowCustomer: false,
};

/**
 * Maps a portion of the state to props for access
 * @param {object} state
 * @returns {object} props retrieved from state
 */
const mapStateToProps = state => (
  {
    user: state.auth.user,
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
    actions: bindActionCreators({ logout }, dispatch),
  }
);


export default connect(mapStateToProps, mapDispatchToProps)(Main);