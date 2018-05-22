import React from 'react';
import Main from '../Main';
import '../../styles/signup.scss';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      accountType: '',
    };
  }

  render() {
    return (
      <Main>
        { /* Content starts */}
        <div className="overall">
          <div className="intro">
            <div className="intro-content">
              <div className="container white-text title text-center">
                Book-A-Meal
          </div>
              <div className="container white-text text-center">
                <h2>Book a meal in 3 easy steps:</h2>
                <div className="list-container">
                  <ol className="list-steps">
                    <li>Create an Account</li>
                    <li>Sign in to your account</li>
                    <li>Order for any meal on the menu</li>
                  </ol>
                </div>
                <p>Simple as reading A, B, C. right ?</p>
              </div>
            </div>

          </div>
          <div className="signup-content">
            <div className="container text-center">
              <h1 className="black-text bold-text">Create an account</h1>
            </div>
            <div className="container">
              <form onSubmit="redirectTo('../orders/order-menu.html'); return false;">
                <div>
                  <h4 className="black-text light-text">Username</h4>
                  <input type="text" required className="signup-textbox textbox" placeholder="Enter username here..." />
                </div>
                <div>
                  <h4 className="black-text light-text">Email</h4>
                  <input type="email" required className="signup-textbox textbox" placeholder="Enter email here..." />
                </div>
                <div>
                  <h4 className="black-text light-text">Password</h4>
                  <input type="password" required className="signup-textbox textbox" placeholder="Enter password here..." />
                </div>
                <div>
                  <h4 className="black-text light-text">Confirm Password</h4>
                  <input type="password" required className="signup-textbox textbox" placeholder="Enter password again..." />
                </div>
                <div>
                  <h4 className="black-text light-text">Account Type</h4>
                  <select className="signup-select" required>
                    <option>Customer</option>
                    <option>Caterer</option>
                  </select>
                </div>
                <br />
                <br />
                <div className="container text-center">
                  <input type="submit" className="btn btn-secondary" value="Sign Up" />
                </div>
                <br />
                <div className="container text-center">
                  <a href="../users/signin.html" className="secondary-text-color">Have an account ?. Sign In</a>
                </div>
                <br />
              </form>
            </div>
          </div>

        </div>
        { /* Content Ends */}
      </Main>
    );
  }
}

export default Signup;