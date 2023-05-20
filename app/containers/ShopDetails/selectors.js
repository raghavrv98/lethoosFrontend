import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the shopDetails state domain
 */

const selectShopDetailsDomain = state => state.get('shopDetails', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ShopDetails
 */

const makeSelectShopDetails = () =>
  createSelector(selectShopDetailsDomain, substate => substate.toJS());

export default makeSelectShopDetails;
export { selectShopDetailsDomain };
