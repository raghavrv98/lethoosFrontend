import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addOrEditAdminPetrol state domain
 */

const selectAddOrEditAdminPetrolDomain = state =>
  state.get('addOrEditAdminPetrol', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddOrEditAdminPetrol
 */

const makeSelectAddOrEditAdminPetrol = () =>
  createSelector(selectAddOrEditAdminPetrolDomain, substate => substate.toJS());

export default makeSelectAddOrEditAdminPetrol;
export { selectAddOrEditAdminPetrolDomain };
