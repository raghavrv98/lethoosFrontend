import { fromJS } from 'immutable';
import orderDetailsReducer from '../reducer';

describe('orderDetailsReducer', () => {
  it('returns the initial state', () => {
    expect(orderDetailsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
