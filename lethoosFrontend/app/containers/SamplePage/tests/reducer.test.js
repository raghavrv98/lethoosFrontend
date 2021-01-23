import { fromJS } from 'immutable';
import samplePageReducer from '../reducer';

describe('samplePageReducer', () => {
  it('returns the initial state', () => {
    expect(samplePageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
