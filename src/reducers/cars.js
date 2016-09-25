import { fromJS } from 'immutable';
import Names from '../actions/names';

export default function (state = {}, action) {
  switch (action.type) {
    case Names.Car.added:
    case Names.Car.changed:
      return fromJS(state).setIn(['cars', action.payload.id], action.payload.car).toJS();
    case Names.Car.removed:
      return fromJS(state).deleteIn(['cars', action.payload.id]).toJS();
    default:
      return state;
  }
}
