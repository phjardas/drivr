import { ActionTree, ActionContext } from 'vuex';
import { firestore, firestoreModule } from '../../firebase/firestore';
import { FirebaseFirestore, DocumentReference, CollectionReference } from '@firebase/firestore-types';

import { AdminState } from './state';
import { Statistics } from './model';
import { syncFirestoreDoc, Unsubscribe } from '../firestore';

export const actions: ActionTree<AdminState, any> = {
  loadAdminStatistics(context): Promise<Unsubscribe> {
    return syncFirestoreDoc(context, {
      ref: firestore.doc('statistics/global'),
      mutationPrefix: 'adminStatistics',
    });
  },
};
