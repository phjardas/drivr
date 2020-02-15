import { useDocument } from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase';
import { materialize } from './utils';

export function useUser(id) {
  const [data, loading, error] = useDocument(firestore.collection('users').doc(id), { snapshotListenOptions: { includeMetadataChanges: true } });
  if (loading || error || !data) return [data, loading, error];
  return [materialize(data), false];
}
