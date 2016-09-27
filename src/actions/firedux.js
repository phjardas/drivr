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
  const unsubscribers = [];

  for (let event in events) {
    if (events[event] in actions) {
      const listener = dispatchFromSnapshot(actions[events[event]], store);
      ref.on(event, listener);
      unsubscribers.push(() => ref.off(event, listener));
    }
  }

  return {
    unsubscribe() {
      unsubscribers.forEach(u => u());
    }
  };
}
