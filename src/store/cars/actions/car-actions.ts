import { ActionTree, ActionContext } from 'vuex';
import { firestore } from '../../../firebase/firestore';

import { CarsState } from '../state';
import { Car, CarData } from '../model';
import { syncFirestoreCollection, Unsubscribe } from '../../firestore';

export const actions: ActionTree<CarsState, any> = {
  async loadCars(context: ActionContext<CarsState, any>): Promise<Unsubscribe> {
    const userId: string = context.rootGetters.userId;
    return syncFirestoreCollection(context, {
      ref: firestore.collection(`cars`).where(`users.${userId}`, '==', true),
      mutationPrefix: 'loadCars',
      transform(car: any) {
        return { ...car, owned: car.ownerId === userId };
      },
    });
  },

  async createCar({ rootGetters }, car: CarData): Promise<Car> {
    const userId: string = rootGetters.userId;
    const ref = await firestore.collection('cars').add({ ...car, ownerId: userId, users: { [userId]: true } });
    const doc = await ref.get();
    return { ...doc.data(), id: doc.id } as Car;
  },

  async deleteCar({ dispatch }, payload: { carId: string }): Promise<any> {
    await dispatch('deleteRefuels', { carId: payload.carId });
    await firestore.doc(`cars/${payload.carId}`).delete();
  },
};
