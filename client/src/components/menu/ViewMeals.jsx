import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Main from '../Main';
import MealList from '../meals/MealList';
import { getMenuById } from '../../actions/menuActions';

export class ViewMeals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: {},
      pagination: {},
    };

    this.fetchData = this.fetchData.bind(this);
  }

  /**
   * this is called after the component is mounted
   */
  componentDidMount() {
    this.fetchData(0, 4);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      menu: nextProps.menu,
      pagination: nextProps.pagination,
    });
  }

  /**
   * method to call action to fetch data from the server
   * it then updates the state
   * @param {Number} offset
   * @param {Number} limit
   */
  fetchData(offset, limit) {
    const { id } = this.props.match.params;
    if (id) {
      this.props.actions.getMenuById(id, limit, offset);
    }
  }

  render() {
    return (
      <Main allowCaterer>
        { !isEmpty(this.state.menu) &&
          <div className="container">
          <h1 className="secondary-text-color text-center">View Menu Options</h1>
          {this.state.menu.name &&
            <h2 className="black-text bold-text text-center">{this.state.menu.name}</h2>
          }
          </div>
        }
        { isEmpty(this.state.menu) &&
          <div className="container">
          <h1 className="secondary-text-color text-center">Menu not found</h1>
          </div>
        }
        { !isEmpty(this.state.menu) && !isEmpty(this.state.menu.meals) &&
          <MealList
            meals={this.state.menu.meals}
            pagination={this.state.pagination}
            showEdit={false}
            showDelete={false}
            fetchData={this.fetchData} />
        }
        { !isEmpty(this.state.menu) && isEmpty(this.state.menu.meals) &&
          <div className="container">
          <h2 className="text-center">No meal is set</h2>
          </div>
        }
      </Main>
    );
  }
}

// proptypes
ViewMeals.propTypes = {
  menu: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

/**
 * Maps a portion of the state to props for access
 * @param {object} state
 * @returns {object} props retrieved from state
 */
const mapStateToProps = state => (
  {
    menu: state.menus.menu,
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
    actions: bindActionCreators({ getMenuById }, dispatch),
  }
);


export default connect(mapStateToProps, mapDispatchToProps)(ViewMeals);
