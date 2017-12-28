import { Module } from 'vuex';

import { actions } from './actions';
import { InvitesState, state } from './state';
import { mutations } from './mutations';

export { CarInfo, UserInfo, InviteData, Invite } from './model';
export { InvitesState } from './state';

export const module: Module<InvitesState, any> = { state, actions, mutations };
