import * as fs from 'fs';
import { CollectionReference, DocumentSnapshot } from '@firebase/firestore-types';
import { firestore } from './common';

interface DocumentBackup {
  id: string;
  data: any;
  collections?: CollectionBackup[];
}

interface CollectionBackup {
  id: string;
  documents?: DocumentBackup[];
}

async function backupCollection(collRef: CollectionReference): Promise<CollectionBackup> {
  const snapshot = await collRef.get();
  const documents: DocumentBackup[] = await Promise.all(snapshot.docs.map(backupDocument));
  return { id: collRef.id, documents };
}

async function backupDocument(doc: DocumentSnapshot): Promise<DocumentBackup> {
  const colls: CollectionReference[] = await (doc.ref as any).getCollections();
  const collections: CollectionBackup[] | undefined = colls.length
    ? await Promise.all(colls.map(backupCollection))
    : undefined;
  return { id: doc.id, data: doc.data(), collections };
}

async function createBackup(): Promise<any> {
  console.log('creating backup');
  const createdAt = new Date();
  const collections: CollectionReference[] = await firestore.getCollections();
  console.log('backing up %d collections', collections.length);
  const data = await Promise.all(collections.map(backupCollection));
  return { createdAt, collections: data };
}

async function main() {
  const data = await createBackup();
  const filename = 'backup.json';
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
  console.log('backup written to %s', filename);
}

main()
  .then(() => console.log('done'))
  .catch(err => console.error('ERROR:', err));
