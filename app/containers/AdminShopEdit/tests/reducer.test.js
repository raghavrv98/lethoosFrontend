import { fromJS } from 'immutable';
import adminShopEditReducer from '../reducer';

describe('adminShopEditReducer', () => {
  it('returns the initial state', () => {
    expect(adminShopEditReducer(undefined, {})).toEqual(fromJS({}));
  });
});
