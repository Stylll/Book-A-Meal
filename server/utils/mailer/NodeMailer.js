import nodemailer from 'nodemailer';

require('dotenv').config();

/**
 * creates a nodemailer transporter method
 */
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  secure: false,
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_ACCOUNT_PASSWORD,
  },
});

/**
 * Creates a method to return the mail options for the transporter
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 * @returns {object} mail option object
 */
const mailOptions = (to, subject, html) => ({
  from: '"Book A Meal App" <noreply@bookameal.com>',
  to,
  subject,
  html,
});

/**
 * Creates a method to return the mail content for a forgot password mail
 * @param {string} url
 * @param {string} username
 * @param {string} resetToken
 * @returns {string} mail content
 */
const forgotPasswordMail = (url, username, resetToken) => (
  `<div>
  <p>Hello ${username},
    <br /><br />
    It seems you requested to change your password.
    <br /><br />
  If that sounds right, kindly click on the link below or paste it into your
  browser to complete the process.
    <br>
  Please note that the link is only valid for 1 hour.
    <br>
  <a href='http://${url}/resetpassword/${resetToken}'>http://${url}/resetpassword/${resetToken}</a>
    <br><br />
  If you did not make this request, kindly ignore this
  and your password will remain unchanged.
  </p>
  </div>`
);

/**
 * Creates a method to return the mail content for a password reset mail
 * @param {string} url
 * @param {string} username
 * @returns {string} email content
 */
const passwordResetMail = (url, username) => (
  `<div>
  <p>Hello ${username},
    <br><br />
  Your password has been successfully changed.
    <br><br />
  Click <a href='http://${url}/users/login'>here</a> 
  to login
  </p>
  </div>`
);

export { transporter, mailOptions, forgotPasswordMail, passwordResetMail };
