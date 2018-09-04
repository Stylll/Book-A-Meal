import React from 'react';
import PropTypes from 'prop-types';

/* eslint-disable no-self-compare */

/**
 * Display class
 * It takes in props check and children
 * It checks if check is true or exists and renders its children.
 * If check is false or undefined, it renders null.
 * Good for if else cases.
 */
class Display extends React.Component {
  render() {
    return (this.props.check) ? <div>{this.props.children}</div> : null;
  }
}

/* eslint-disable react/forbid-prop-types */
Display.propTypes = {
  check: PropTypes.any.isRequired,
  children: PropTypes.object.isRequired,
};

export default Display;
