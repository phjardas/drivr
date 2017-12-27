import { AuthState } from './auth';
import { CarsState } from './cars';
import { NavigationState } from './navigation';

export interface RootState {
  auth: AuthState;
  cars: CarsState;
  navigation: NavigationState;
}
