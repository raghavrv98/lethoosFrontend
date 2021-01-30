import { fromJS } from 'immutable';
import orderHistoryPageReducer from '../reducer';

describe('orderHistoryPageReducer', () => {
  it('returns the initial state', () => {
    expect(orderHistoryPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
