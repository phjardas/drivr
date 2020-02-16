import 'core-js';
import functions from 'firebase-functions';
import { executeActions, firestore } from './firebase';
import http from './http';
import { updateCarStatistics } from './stats';

const refuelDoc = functions.firestore.document('cars/{carId}/refuels/{refuelId}');

export const refuel_onWrite = refuelDoc.onWrite((_, context) => {
  return recreateCarStatistics(context.params.carId);
});

async function recreateCarStatistics(carId) {
  return firestore.runTransaction(async (tx) => {
    const refuelsSnapshot = await tx.get(
      firestore
        .collection('cars')
        .doc(carId)
        .collection('refuels')
        .orderBy('date', 'asc')
    );
    const refuels = refuelsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const actions = updateCarStatistics(refuels, carId);
    await executeActions(actions, tx);
  });
}

export const api = functions.https.onRequest(http);
