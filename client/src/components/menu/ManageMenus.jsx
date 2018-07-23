import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Main from '../Main';
import { getMenus } from '../../actions/menuActions';
import MenuList from './MenuList';

export class ManageMenus extends React.Component {
  render() {
    return (
      <Main allowCaterer>
        <div className="container">
        <h1 className="secondary-text-color text-center">Manage Menus</h1>

        <div className="text-center">
          <div>
              <form>
                <input type="date" className="textbox datepicker menu-textbox" placeholder="Search by menu date..." />
                &nbsp;&nbsp;
                <input type="submit" value="GO" className="btn btn-secondary" />
              </form>
          </div>
        </div>
        </div>
        <MenuList menus={this.props.menus} perPage={4} />
      </Main>
    );
  }
}

// proptypes
ManageMenus.propTypes = {
  actions: PropTypes.object.isRequired,
  menus: PropTypes.array.isRequired,
};

/**
 * Maps a portion of the state to props for access
 * @param {object} state
 * @returns {object} props retrieved from state
 */
const mapStateToProps = state => (
  {
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
    actions: bindActionCreators({ getMenus }, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(ManageMenus);