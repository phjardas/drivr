const admin = require('./firebase');
const firestore = admin.firestore();

async function main() {
  const refuels = await firestore.collection('refuels').get();

  await Promise.all(
    refuels.docs.map(async (doc) => {
      const refuel = doc.data();
      console.log('car %s, refuel %s', refuel.carId, doc.id);
      await firestore
        .collection('cars')
        .doc(refuel.carId)
        .collection('refuels')
        .doc(doc.id)
        .set(refuel);
      await doc.ref.delete();
    })
  );
}

main().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
