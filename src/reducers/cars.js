import { fromJS } from 'immutable';
import Names from '../actions/names';

export default function (state = {}, action) {
  switch (action.type) {
    case Names.Car.added:
    case Names.Car.changed:
      return fromJS(state).set(action.payload.id, action.payload).toJS();
    case Names.Car.removed:
      return fromJS(state).delete(action.payload.id).toJS();
    default:
      return state;
  }
}
