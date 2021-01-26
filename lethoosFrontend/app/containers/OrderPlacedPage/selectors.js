import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the orderPlacedPage state domain
 */

const selectOrderPlacedPageDomain = state =>
  state.get('orderPlacedPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by OrderPlacedPage
 */

const makeSelectOrderPlacedPage = () =>
  createSelector(selectOrderPlacedPageDomain, substate => substate.toJS());

export default makeSelectOrderPlacedPage;
export { selectOrderPlacedPageDomain };
