import { SyncedDoc, emptySyncedDoc } from '../firestore/model';
import { Statistics } from './model';

export interface AdminState {
  statistics: SyncedDoc<Statistics>;
}

export const state: AdminState = {
  statistics: emptySyncedDoc(),
};
