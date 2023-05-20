import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the adminShopEdit state domain
 */

const selectAdminShopEditDomain = state =>
  state.get('adminShopEdit', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AdminShopEdit
 */

const makeSelectAdminShopEdit = () =>
  createSelector(selectAdminShopEditDomain, substate => substate.toJS());

export default makeSelectAdminShopEdit;
export { selectAdminShopEditDomain };
