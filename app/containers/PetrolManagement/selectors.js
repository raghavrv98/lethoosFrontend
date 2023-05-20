import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the petrolManagement state domain
 */

const selectPetrolManagementDomain = state =>
  state.get('petrolManagement', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by PetrolManagement
 */

const makeSelectPetrolManagement = () =>
  createSelector(selectPetrolManagementDomain, substate => substate.toJS());

export default makeSelectPetrolManagement;
export { selectPetrolManagementDomain };
