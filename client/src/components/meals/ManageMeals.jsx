import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { isEmpty } from 'lodash';
import Main from '../Main';
import { deleteMeal } from '../../actions/mealActions';
import MealList from './MealList';

export class ManageMeals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

    this.deleteItem = this.deleteItem.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  deleteItem(mealId) {
    this.props.actions.deleteMeal(mealId);
  }

  handleDelete(event, mealId) {
    event.preventDefault();
    confirmAlert({
      customUI: ({ onClose }) => (
          <div className="custom-ui">
            <div className="text-center">
              <img src="../../assets/error.png" alt="success" className="img-responsive img-popup" />
            </div>
            <h1 className="red-text text-center">Are you sure?</h1>
            <div className="row text-center">
                <button className="btn btn-secondary" onClick={onClose}>No</button>
                &nbsp;&nbsp;
                { /* eslint-disable react/jsx-no-bind */}
                <button
                  className="btn btn-danger" onClick={() => {
                    this.deleteItem(mealId);
                    onClose();
                  }}>Yes, Delete it!
                </button>
            </div>
          </div>
      ),
    });
  }

  render() {
    return (
      <Main allowCaterer>
        <div className="container">
        <h1 className="secondary-text-color text-center">Manage Meals</h1>

        <div className="text-center">
          <div>
              <form>
                <input type="text" className="textbox meal-textbox" placeholder="Search by meal name..." />
                &nbsp;&nbsp;
                <input type="submit" value="GO" className="btn btn-secondary" />
              </form>
          </div>
        </div>
        </div>
        <MealList meals={this.props.meals} handleDelete={this.handleDelete} perPage={4} />
      </Main>
    );
  }
}

// proptypes
ManageMeals.propTypes = {
  actions: PropTypes.object.isRequired,
  meals: PropTypes.array.isRequired,
};

/**
 * Maps a portion of the state to props for access
 * @param {object} state
 * @returns {object} props retrieved from state
 */
const mapStateToProps = state => (
  {
    meals: state.meals.meals,
  }
);

/**
 * Maps actions for component
 * @param {function} dispatch
 * @returns {object} actions retrieved from redux actions
 */
const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators({ deleteMeal }, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(ManageMeals);