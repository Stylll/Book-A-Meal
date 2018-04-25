import menus from '../db/menus';
import { getNormalDate } from '../utils/dateBeautifier';

/**
 * Controller Class to handle user meal requests
 */
class MenuController {
  /**
   * static method to handle post requests
   * creates new menu
   * returns menu as json
   * @param {*} req
   * @param {*} res
   */
  static post(req, res) {
    const date = getNormalDate(new Date());
    const newMenu = menus.add({ date, userId: req.decoded.user.id });

    if (newMenu && !newMenu.err) {
      return res.status(201).send({ menu: newMenu });
    }

    return res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default MenuController;
