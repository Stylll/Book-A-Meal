import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import LoadingBar from 'react-redux-loading-bar';
import NavBar from './common/NavBar';

/* eslint-disable no-useless-constructor */
class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    /**
     * Handles output rendered by the component.
     * @returns {jsx} form of the component.
     */
    return (
      <div className="primary-bg-color">
        <LoadingBar className="loadingBar" />
        <NavBar />
        {this.props.children}
      </div>
    );
  }
}

// proptypes
/* eslint-disable react/forbid-prop-types */
Main.propTypes = {
  children: PropTypes.any.isRequired,
};


export default Main;