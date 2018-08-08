/**
 * Job scheduler functions
 * Schedules tasks to be run at specific times
 */
import schedule from 'node-schedule';
import Model from '../models';

/**
 * function to update pending orders to canceled at midnight.
 * runs everyday at 1:00AM.
 */
const cancelPendingOrders = () => {
  const rule = new schedule.RecurrenceRule();
  rule.hour = 1;

  const task = schedule.scheduleJob(rule, () => {
    Model.Orders.update({
      status: 'canceled',
    }, {
      where: { status: 'pending' },
    });
  });
};

/* eslint-disable import/prefer-default-export */
export { cancelPendingOrders };
