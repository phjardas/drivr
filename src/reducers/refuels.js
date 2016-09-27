import { fromJS } from 'immutable';
import Names from '../actions/names';

export default function (state = {}, action) {
  switch (action.type) {
    case Names.Refuel.added:
    case Names.Refuel.changed:
      return fromJS(state).setIn([action.payload.carId, action.payload.id], action.payload).toJS();
    case Names.Refuel.removed:
      return fromJS(state).deleteIn([action.payload.carId, action.payload.id]).toJS();
    case Names.User.logout:
      return {};
    default:
      return state;
  }
}
