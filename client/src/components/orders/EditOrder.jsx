import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Main from '../Main';
import TextInput from '../common/TextInput';
import { saveOrder } from '../../actions/orderActions';
import { getMenu } from '../../actions/menuActions';
import successImage from '../../assets/success.png';
import spinnerGif from '../../assets/spinner.gif';

export class EditOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      image: '',
      price: 0,
      quantity: 0,
      cost: 0,
      complete: false,
      errors: {},
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setup = this.setup.bind(this);
    this.sendOrder = this.sendOrder.bind(this);
  }

  componentDidMount() {
    this.props.actions.getMenu();
    this.setup(this.props.menu, this.props.orders);
  }

  componentWillReceiveProps(nextProps) {
    this.setup(nextProps.menu, nextProps.orders);
  }

  /**
   * class method to load menu details into state if it exists.
   * @param {object} menu
   * @param {array} orders
   * uses the mealId provided in the url to find a matching meal in the menu.
   * uses the id provided in the url to find a matching order in the orders list.
   * then updates the state with the records.
   */
  setup(menu, orders) {
    const { mealId, id } = this.props.match.params;

    if (id && orders.length > 0) {
      // if order id is passed and the customer has orders in state
      const order = orders.find(x => x.id === Number.parseInt(id, 10));
      if (order) {
        this.setState({
          id: order.id,
          mealId: order.mealId,
          name: order.meal.name,
          image: order.meal.image,
          price: order.price.toString(),
          quantity: order.quantity,
          cost: order.cost,
          meal: order.meal,
          status: order.status,
        });
      }
    } else if (mealId && !isEmpty(menu)) {
      // this is a new order and the meal exists in the menu for the day
      const meal = menu.meals.find(x => x.id === Number.parseInt(mealId, 10));
      if (meal) {
        this.setState({
          mealId: meal.id,
          name: meal.name,
          image: meal.image,
          price: meal.price.toString(),
          quantity: 0,
          cost: 0,
          meal,
        });
      }
    } else {
      this.props.history.push('/customer/menu');
    }
  }

  /**
   * method to handle element changes.
   * @param {object} event
   * updates the state with event value.
   */
  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
      cost: parseInt(event.target.value, 10) * this.state.price,
    });
  }

  /**
   * method to validate save order form.
   * updates the state with error object if any
   * @returns {bool} isValid
   */
  isValid() {
    if (this.state.quantity < 1) {
      this.setState({
        errors: {
          quantity: 'Quantity must be greater than zero',
        },
        loading: false,
      });
      return false;
    }
    this.setState({
      errors: {},
    });
    return true;
  }

  /**
   * method to send order object to the action
   * @param {object} state
   */
  sendOrder(state) {
    let orderObject = { ...state };
    if (state.id) {
      // means an order is being updated
      orderObject = {
        id: state.id,
        mealId: state.mealId,
        quantity: state.quantity,
        meal: state.meal,
        status: state.status,
      };
    }
    this.props.actions.saveOrder(orderObject)
      .then(() => {
        if (isEmpty(this.props.errors)) {
          this.setState({
            complete: true,
            errors: {},
            loading: true,
          });
        } else {
          this.setState({
            complete: false,
            errors: this.props.errors,
            loading: false,
          });
        }
      });
  }

  /**
   * method to submit form to api.
   * calls saveOrder action if form is valid.
   * @param {object} event
   */
  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    if (this.isValid()) {
      this.sendOrder(this.state);
    }
  }

  render() {
    return (
      <Main allowCustomer>
        {/* Display form if order is not complete */}
        {!this.state.complete && <div>
          {/* Header Content Start */}
          <div className="container text-center">
            <h1 className="secondary-text-color">Confirm your order</h1>
          </div>
          {/* Header Content End */}
          {/* Main Content Start */}
          <div className="container text-center black-text">
            <div className="order-form">
              <div className="container">
                <img src={this.state.image} alt="meal-image" className="img-responsive" />
              </div>
              <div className="card-content">
                <div className="card-text black-text">
                  <form>
                    <h2 className="black-text bold-text">{this.state.name}</h2>
                    <h4 className="black-text normal-text">Price: &#8358;{this.state.price}</h4>
                    <h4>Select Quantity (plates):</h4>
                    <TextInput
                      name="quantity"
                      type="number"
                      value={this.state.quantity}
                      required
                      className="order-textbox textbox"
                      onChange={this.handleChange}
                      error={this.state.errors.quantity}
                    />
                    <h3 className="black-text light-text">Cost: &#8358;{this.state.cost}</h3>
                    {!this.state.loading &&
                    <input type="button" onClick={this.handleSubmit} className="btn btn-secondary" value="Confirm" />
                    }
                    {this.state.loading &&
                    <img src={spinnerGif} alt="loading" className="spinner" />
                    }
                  </form>
                  <br />
                  <NavLink to="/customer/menu">Back to menu</NavLink>
                </div>
              </div>
            </div>
          </div>
          <br />
          {/* Main Content End */}
        </div>
        }

        {/* Display thank you page if order is complete */}
        {this.state.complete && <div>
          <div className="container text-center black-text">
            <h1 className="secondary-text-color">Order Complete</h1>
            <div className="">
              <img src={successImage} alt="success" className="img-responsive" />
            </div>
            <div className="">
              <h1 className="black-text bold-text">Thank you</h1>
              <h3 className="black-text light-text">Your order has been received and will be delivered shortly</h3>
              <br />
              <NavLink to="/customer/menu">Back to Menu</NavLink>
            </div>
            </div>
        </div>}
      </Main>
    );
  }
}

// proptypes
EditOrder.propTypes = {
  actions: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  menu: PropTypes.object.isRequired,
  orders: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

/**
 * Maps a portion of the state to props for access
 * @param {object} state
 * @returns {object} props retrieved from state
 */
const mapStateToProps = state => (
  {
    errors: state.orders.customerOrders.errors,
    orders: state.orders.customerOrders.orders,
    menu: state.menus.currentMenu,
  }
);

/**
 * Maps actions for component
 * @param {function} dispatch
 * @returns {object} actions retrieved from redux actions
 */
const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators({ saveOrder, getMenu }, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(EditOrder);
