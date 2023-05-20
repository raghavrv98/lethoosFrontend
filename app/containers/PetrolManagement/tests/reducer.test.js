import { fromJS } from 'immutable';
import petrolManagementReducer from '../reducer';

describe('petrolManagementReducer', () => {
  it('returns the initial state', () => {
    expect(petrolManagementReducer(undefined, {})).toEqual(fromJS({}));
  });
});
