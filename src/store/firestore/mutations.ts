import { MutationTree } from 'vuex';
import { setDeep, unsetDeep } from './util';
import {
  SYNC_COLLECTION_STARTED,
  SYNC_COLLECTION_READY,
  SYNC_COLLECTION_STOPPED,
  SYNC_COLLECTION_FAILED,
  DOC_ADDED,
  DOC_MODIFIED,
  DOC_REMOVED,
} from './mutation-types';

export const mutations: MutationTree<any> = {
  [SYNC_COLLECTION_STARTED](state, { storePath }) {
    setDeep(state, storePath, {
      loading: true,
      loaded: false,
      failed: false,
      error: null,
      items: {},
    });
  },

  [SYNC_COLLECTION_READY](state, { storePath }) {
    setDeep(state, [...storePath, 'loading'], false);
    setDeep(state, [...storePath, 'loaded'], true);
  },

  [SYNC_COLLECTION_STOPPED](state, { storePath }) {
    setDeep(state, storePath, {
      loading: false,
      loaded: false,
      failed: false,
      error: null,
      items: {},
    });
  },

  [SYNC_COLLECTION_FAILED](state, { storePath, error }) {
    setDeep(state, storePath, {
      loading: false,
      loaded: false,
      failed: true,
      error,
      items: {},
    });
  },

  [DOC_ADDED](state, { storePath, id, doc }) {
    setDeep(state, [...storePath, 'items', id], { id, ...doc });
  },

  [DOC_MODIFIED](state, { storePath, id, doc }) {
    setDeep(state, [...storePath, 'items', id], { id, ...doc });
  },

  [DOC_REMOVED](state, { storePath, id }) {
    unsetDeep(state, [...storePath, 'items', id]);
  },
};
