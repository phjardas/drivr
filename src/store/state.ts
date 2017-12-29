import { AuthState } from './auth';
import { CarsState } from './cars';
import { InvitesState } from './invites';
import { NavigationState } from './navigation';
import { RefuelsState } from './refuels';

export interface RootState {
  auth: AuthState;
  cars: CarsState;
  invites: InvitesState;
  navigation: NavigationState;
  refuels: RefuelsState;
}
