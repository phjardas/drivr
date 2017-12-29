import { ActionContext } from 'vuex';
import { Query, DocumentChange } from '@firebase/firestore-types';
import { firestore } from '../../firebase';
import { SyncedCollection, Unsubscribe } from './model';

export interface SyncFirestoreCollectionParams {
  ref: Query;
  mutationPrefix: string;
  transform?(item: any): any | Promise<any>;
  context?: any;
}

export async function syncFirestoreCollection<S, R>(
  context: ActionContext<S, R>,
  params: SyncFirestoreCollectionParams
): Promise<Unsubscribe> {
  const { commit } = context;
  const { ref, mutationPrefix } = params;
  const transform = params.transform || ((item: any) => item);
  const mutationContext = { context: params.context || {} };
  commit(`${mutationPrefix}.started`, mutationContext);

  const handleError = (error: Error) =>
    commit(`${mutationPrefix}.failed`, { ...mutationContext, error: { message: error.message } });

  const publish = async (type: string, change: DocumentChange) => {
    const doc = await transform({ id: change.doc.id, ...change.doc.data() });
    if (doc) commit(`${mutationPrefix}.${type}`, { ...mutationContext, id: change.doc.id, doc });
  };

  try {
    let ready = false;
    const unsubscribe = ref.onSnapshot(async snapshot => {
      snapshot.docChanges.forEach(async change => {
        switch (change.type) {
          case 'added':
            publish('added', change);
            break;
          case 'modified':
            publish('modified', change);
            break;
          case 'removed':
            commit(`${mutationPrefix}.removed`, { ...mutationContext, id: change.doc.id });
            break;
          default:
            console.warn('Unrecognized document change:', change);
        }
      });

      if (!ready) {
        commit(`${mutationPrefix}.ready`, mutationContext);
        ready = true;
      }
    }, handleError);

    return () => {
      unsubscribe();
      commit(`${mutationPrefix}.stopped`, mutationContext);
    };
  } catch (error) {
    handleError(error);
    throw error;
  }
}
