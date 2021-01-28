import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the offersPage state domain
 */

const selectOffersPageDomain = state => state.get('offersPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by OffersPage
 */

const makeSelectOffersPage = () =>
  createSelector(selectOffersPageDomain, substate => substate.toJS());

export default makeSelectOffersPage;
export { selectOffersPageDomain };
