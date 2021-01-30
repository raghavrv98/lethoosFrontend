import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the orderHistoryPage state domain
 */

const selectOrderHistoryPageDomain = state =>
  state.get('orderHistoryPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by OrderHistoryPage
 */

const makeSelectOrderHistoryPage = () =>
  createSelector(selectOrderHistoryPageDomain, substate => substate.toJS());

export default makeSelectOrderHistoryPage;
export { selectOrderHistoryPageDomain };
