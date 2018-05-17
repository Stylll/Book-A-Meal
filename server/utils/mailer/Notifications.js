import { transporter, bccMailOptions, menuSetNotification } from './NodeMailer';
import { Users as UserModel } from '../../models';
/**
 * Class to contain all notification methods
 */
class Notifications {
  /**
   * Customer notifier to send email when the day's menu is set
   * @param {string} url
   * @param {object} menu
   */
  static async customerMenuNotifier(url, menu) {
    // populate meal list
    let meals = '';
    menu.meals.forEach((meal) => {
      meals += `<li>${meal.name}</li>`;
    });

    // get all customers
    return UserModel.findAll({
      where: {
        accountType: 'customer',
      },
      attributes: ['email'],
    }).then((users) => {
      if (users && users.length > 0) {
        const to = '';
        const bcc = users.map(user => user.email);
        const subject = 'Book A Meal - Menu Set';
        return transporter.sendMail(bccMailOptions(
          to,
          bcc,
          subject,
          menuSetNotification(url, meals),
        ));
      }
      return null;
    });
  }
}

export default Notifications;
