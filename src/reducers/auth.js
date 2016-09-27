import { fromJS } from 'immutable';
import Names from '../actions/names';

export default function (state = {}, action) {
  switch (action.type) {
    case Names.User.login:
      return fromJS(state).set('user', action.payload).toJS();
    case Names.User.logout:
      return fromJS(state).delete('user').toJS();
    default:
      return state;
  }
}
