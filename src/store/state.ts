import { AdminState } from './admin';
import { AuthState } from './auth';
import { CarsState } from './cars';
import { InvitesState } from './invites';
import { NavigationState } from './navigation';

export interface RootState {
  admin: AdminState;
  auth: AuthState;
  cars: CarsState;
  invites: InvitesState;
  navigation: NavigationState;
}
