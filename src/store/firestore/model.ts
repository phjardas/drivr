import { SyncFirestoreCollectionParams } from './index';

export interface SyncedDoc<E> {
  loading: boolean;
  loaded: boolean;
  failed: boolean;
  error: any;
  item?: E;
}

export function emptySyncedDoc<E>(): SyncedDoc<E> {
  return { loading: false, loaded: false, failed: false, error: null };
}

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

export interface Unsubscribe {
  (): void;
}
