import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Main from '../Main';
import MealList from '../meals/MealList';

export class ViewMeals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: {
        meals: [],
      },
    };

    this.setup = this.setup.bind(this);
  }

  /**
   * this is called after the component is mounted
   */
  componentDidMount() {
    this.setup(this.props.menus);
  }

  /**
   * this is called when the component is about to receive new props
   * @param {object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    this.setup(nextProps.menus);
  }

  /**
   * class method to load menu into state if it exists.
   * @param {array} menu
   * uses the id provided in the url to find a matching menu.
   * then updates the state with the records.
   */
  setup(menus) {
    const { id } = this.props.match.params;
    if (id && menus.length > 0) {
      const menu = menus.find(m => m.id === Number.parseInt(id, 10));
      if (menu) {
        this.setState({
          menu,
        });
      }
    }
  }

  render() {
    return (
      <Main allowCaterer>
        <div className="container">
        <h1 className="secondary-text-color text-center">View Menu Options</h1>
        {this.state.menu.name &&
          <h2 className="black-text bold-text text-center">{this.state.menu.name}</h2>
        }
        </div>
        <MealList meals={this.state.menu.meals} perPage={8} showEdit={false} showDelete={false} />
      </Main>
    );
  }
}

// proptypes
ViewMeals.propTypes = {
  menus: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired,
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


export default connect(mapStateToProps)(ViewMeals);