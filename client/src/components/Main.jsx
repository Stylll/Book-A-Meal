import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
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
      <div>
        <NavBar />
        {this.props.children}
      </div>
    );
  }
}

// proptypes
Main.propTypes = {
  children: PropTypes.object.isRequired,
};

export default Main;