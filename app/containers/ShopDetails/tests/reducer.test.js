import { fromJS } from 'immutable';
import shopDetailsReducer from '../reducer';

describe('shopDetailsReducer', () => {
  it('returns the initial state', () => {
    expect(shopDetailsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
