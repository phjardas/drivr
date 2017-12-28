import { Invite } from './model';

export interface Entity<T> {
  loading: boolean;
  error?: { message: string };
  entity?: T;
}

export interface Acceptance {}

export interface InvitesState {
  invites: { [id: string]: Entity<Invite> };
  accepts: { [id: string]: Entity<Acceptance> };
}

export const state: InvitesState = {
  invites: {},
  accepts: {},
};
