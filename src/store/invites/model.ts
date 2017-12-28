export interface UserInfo {
  id: string;
  label: string;
}

export interface CarInfo {
  id: string;
  label: string;
}

export interface InviteData {
  inviter: UserInfo;
  car: CarInfo;
}

export interface Invite extends InviteData {
  id: string;
  createdAt: Date;
  acceptedAt?: Date;
  invitee?: UserInfo;
}
