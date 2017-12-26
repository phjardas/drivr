import * as firebase from 'firebase';
import {
  SYNC_COLLECTION_STARTED,
  SYNC_COLLECTION_READY,
  SYNC_COLLECTION_STOPPED,
  SYNC_COLLECTION_FAILED,
  DOC_ADDED,
  DOC_MODIFIED,
  DOC_REMOVED,
} from './mutation-types';

export default {
  firestoreSyncCollection({ commit }, { collection, storePath: storePathIn }) {
    const storePath = Array.isArray(storePathIn) ? storePathIn : storePathIn.split(/\//);
    console.log('synchronizing firestore collection %s to', collection, storePath);
    commit(SYNC_COLLECTION_STARTED, { collection, storePath });

    let ready = false;
    const unsubscribe = firebase
      .firestore()
      .collection(collection)
      .onSnapshot(
        snapshot => {
          snapshot.docChanges.forEach(change => {
            switch (change.type) {
              case 'added':
                commit(DOC_ADDED, { storePath, id: change.doc.id, doc: change.doc.data() });
                break;
              case 'modified':
                commit(DOC_MODIFIED, { storePath, id: change.doc.id, doc: change.doc.data() });
                break;
              case 'removed':
                commit(DOC_REMOVED, { storePath, id: change.doc.id });
                break;
              default:
                console.warn('Unrecognized document change:', change);
            }
          });

          if (!ready) {
            commit(SYNC_COLLECTION_READY, { collection, storePath });
            ready = true;
          }
        },
        error => {
          console.error(`Error subscribing to collection ${collection}:`, error);
          commit(SYNC_COLLECTION_FAILED, { collection, storePath, error });
        }
      );

    return () => {
      console.log('unsubscribing from firestore collection %s', collection);
      commit(SYNC_COLLECTION_STOPPED, { collection, storePath });
      unsubscribe();
    };
  },
};
