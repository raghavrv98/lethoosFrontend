import { fromJS } from 'immutable';
import orderPlacedPageReducer from '../reducer';

describe('orderPlacedPageReducer', () => {
  it('returns the initial state', () => {
    expect(orderPlacedPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
