import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the orderDetails state domain
 */

const selectOrderDetailsDomain = state =>
  state.get('orderDetails', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by OrderDetails
 */

const makeSelectOrderDetails = () =>
  createSelector(selectOrderDetailsDomain, substate => substate.toJS());

export default makeSelectOrderDetails;
export { selectOrderDetailsDomain };
