import { fromJS } from 'immutable';
import offersPageReducer from '../reducer';

describe('offersPageReducer', () => {
  it('returns the initial state', () => {
    expect(offersPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
