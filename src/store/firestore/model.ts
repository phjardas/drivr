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
