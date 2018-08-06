import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Main from '../Main';
import MenuList from './MenuList';
import { getMenus } from '../../actions/menuActions';

export class ManageMenus extends React.Component {
  constructor(props) {
    super(props);

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData(0, 10);
  }

  /**
   * method to call action to fetch data from the server
   * it then updates the state
   * @param {Number} offset
   * @param {Number} limit
   */
  fetchData(offset, limit) {
    this.props.actions.getMenus(limit, offset);
  }

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
        <br/><br />
        <div className="container text-center create-menu">
          <NavLink to="/caterer/menus/edit" className="btn btn-secondary">Create Menu</NavLink>
        </div>
        <MenuList
          menus={this.props.menus}
          pagination={this.props.pagination}
          perPage={4}
          fetchData={this.fetchData} />
      </Main>
    );
  }
}

// proptypes
ManageMenus.propTypes = {
  actions: PropTypes.object.isRequired,
  menus: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
};

/**
 * Maps a portion of the state to props for access
 * @param {object} state
 * @returns {object} props retrieved from state
 */
const mapStateToProps = state => (
  {
    menus: state.menus.menus,
    pagination: state.menus.pagination,
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
