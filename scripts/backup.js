const fs = require('fs');
const { firestore } = require('./common');

async function backupCollection(collRef) {
  const snapshot = await collRef.get();
  const documents = await Promise.all(snapshot.docs.map(backupDocument));
  return { id: collRef.id, documents };
}

async function backupDocument(doc) {
  const colls = await (doc.ref).getCollections();
  const collections = colls.length
    ? await Promise.all(colls.map(backupCollection))
    : undefined;
  return { id: doc.id, data: doc.data(), collections };
}

async function createBackup() {
  console.log('creating backup');
  const createdAt = new Date();
  const collections = await firestore.getCollections();
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
