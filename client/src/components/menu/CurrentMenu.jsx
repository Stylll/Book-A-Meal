import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Main from '../Main';
import MealList from '../meals/MealList';
import { getMenu } from '../../actions/menuActions';

export class CurrentMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenu: {},
    };

    this.fetchData = this.fetchData.bind(this);
  }

  /**
   * this is called after the component is mounted
   * it calls the action to get latest menu record from the server
   */
  componentDidMount() {
    this.fetchData(0, 10);
  }

  /**
   * this is called when the component is about to receive new props
   * @param {object} nextProps
   * updates the component state with the current menu
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      currentMenu: nextProps.currentMenu,
    });
  }

  /**
   * method to call action to fetch data from the server
   * it then updates the state
   * @param {Number} offset
   * @param {Number} limit
   */
  fetchData(offset, limit) {
    this.props.actions.getMenu(limit, offset);
  }

  render() {
    return (
      <Main allowCustomer>
        <div className="container text-center black-text">
          <div>
            <h1 className="black-text bold-text">Welcome to Book-A-Meal</h1>
            <h4>Your online restaurant to find the finest cuisines.</h4>
            <p>Below is a list of our meal options for the day</p>
          </div>
        </div>
        {isEmpty(this.state.currentMenu) &&
        <div className="text-center">
          <h1>We are working on creating the best menu for you.
            Please check back in a few hours.</h1>
        </div>
        }
        {this.state.currentMenu.meals &&
        <MealList meals={this.state.currentMenu.meals}
          pagination={this.props.pagination}
          showEdit={false}
          showDelete={false}
          showOrder
          fetchData={this.fetchData} />
          }
      </Main>
    );
  }
}

// proptypes
CurrentMenu.propTypes = {
  currentMenu: PropTypes.object,
  actions: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
};

// default props
CurrentMenu.defaultProps = {
  currentMenu: {},
};

/**
 * Maps a portion of the state to props for access
 * @param {object} state
 * @returns {object} props retrieved from state
 */
const mapStateToProps = state => (
  {
    currentMenu: state.menus.currentMenu,
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
    actions: bindActionCreators({ getMenu }, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CurrentMenu);
