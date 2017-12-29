import { SyncFirestoreCollectionParams } from './index';

export interface SyncedCollection<E> {
  loading: boolean;
  loaded: boolean;
  failed: boolean;
  error: any;
  items: { [id: string]: E };
}

export function emptySyncedCollection<E>(): SyncedCollection<E> {
  return { loading: false, loaded: false, failed: false, error: null, items: {} };
}

export function mergeSyncedCollections<E>(...collections: SyncedCollection<E>[]): SyncedCollection<E> {
  return {
    loaded: collections.every(coll => coll.loaded),
    loading: collections.some(coll => coll.loading),
    failed: collections.some(coll => coll.failed),
    error: collections.find(coll => coll.error),
    items: collections.reduce((a, b) => ({ ...a, ...b.items }), {}),
  };
}

export interface Unsubscribe {
  (): void;
}
