import functions from 'firebase-functions';
import { updateCarStatistics } from './stats';

const refuelDoc = functions.firestore.document('cars/{carId}/refuels/{refuelId}');

export const refuel_onWrite = refuelDoc.onWrite((_, context) => {
  return updateCarStatistics(context.params.carId);
});
