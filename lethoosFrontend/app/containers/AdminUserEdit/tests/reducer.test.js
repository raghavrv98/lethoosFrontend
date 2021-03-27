import { fromJS } from 'immutable';
import adminUserEditReducer from '../reducer';

describe('adminUserEditReducer', () => {
  it('returns the initial state', () => {
    expect(adminUserEditReducer(undefined, {})).toEqual(fromJS({}));
  });
});
