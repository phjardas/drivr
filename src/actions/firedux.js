const events = {
  child_added: 'added',
  child_changed: 'changed',
  child_removed: 'removed',
  child_moved: 'moved',
};

function dispatchFromSnapshot(type, store) {
  return snapshot => store.dispatch({
    type: type,
    payload: Object.assign({ id: snapshot.key }, snapshot.val()),
  });
}

export function registerFirebaseListeners(ref, actions, store) {
  for (let event in events) {
    if (events[event] in actions) {
      ref.on(event, dispatchFromSnapshot(actions[events[event]], store));
    }
  }
}
