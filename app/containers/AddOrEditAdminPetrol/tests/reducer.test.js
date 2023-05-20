import { fromJS } from 'immutable';
import addOrEditAdminPetrolReducer from '../reducer';

describe('addOrEditAdminPetrolReducer', () => {
  it('returns the initial state', () => {
    expect(addOrEditAdminPetrolReducer(undefined, {})).toEqual(fromJS({}));
  });
});
