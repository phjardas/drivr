import { MutationTree } from 'vuex';

import { emptySyncedCollection } from './model';
import { setDeep, unsetDeep } from './util';

export interface MapMutationsParams {
  prefix: string;
  statePath: string[] | ((context: any) => string[]);
}

export function mapMutations<S>(params: MapMutationsParams): MutationTree<S> {
  const { prefix, statePath } = params;
  const getStatePath: (context: any) => string[] = typeof statePath === 'function' ? statePath : () => statePath;

  return {
    [`${prefix}.started`](state, mutation) {
      setDeep(state, getStatePath(mutation.context), { ...emptySyncedCollection(), loading: true });
    },
    [`${prefix}.stopped`](state, mutation) {
      setDeep(state, getStatePath(mutation.context), emptySyncedCollection());
    },
    [`${prefix}.ready`](state, mutation) {
      setDeep(state, [...getStatePath(mutation.context), 'loading'], false);
      setDeep(state, [...getStatePath(mutation.context), 'loaded'], true);
    },
    [`${prefix}.failed`](state, mutation) {
      setDeep(state, [...getStatePath(mutation.context), 'loading'], false);
      setDeep(state, [...getStatePath(mutation.context), 'failed'], true);
      setDeep(state, [...getStatePath(mutation.context), 'error'], mutation.error);
    },
    [`${prefix}.added`](state, mutation) {
      setDeep(state, [...getStatePath(mutation.context), 'items', mutation.id], mutation.doc);
    },
    [`${prefix}.modified`](state, mutation) {
      setDeep(state, [...getStatePath(mutation.context), 'items', mutation.id], mutation.doc);
    },
    [`${prefix}.removed`](state, mutation) {
      unsetDeep(state, [...getStatePath(mutation.context), 'items', mutation.id]);
    },
  };
}
