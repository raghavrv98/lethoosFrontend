import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the adminUserEdit state domain
 */

const selectAdminUserEditDomain = state =>
  state.get('adminUserEdit', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by AdminUserEdit
 */

const makeSelectAdminUserEdit = () =>
  createSelector(selectAdminUserEditDomain, substate => substate.toJS());

export default makeSelectAdminUserEdit;
export { selectAdminUserEditDomain };
