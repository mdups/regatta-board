export type AccountType = 'boat' | 'crew';

export type SailingType = 'racing' | 'practice' | 'cruising';

export const SAILING_TYPES: SailingType[] = ['racing', 'practice', 'cruising'];

export interface IUserData {
  id: string;
  email: string;
  type: AccountType;
  name: string;
  hometown: string;
  experience?: string;
  weight?: string;
  sailingTypes?: SailingType[];
  age?: number;
  gender?: string;
  pushToken?: string | null;
  avaliable: boolean;
}

export interface ISNN {
  id: string;
  user: IUserData;
  boatName: string;
  boatClass: string;
  positionNeeded: string;
  reportTime: Date;
  location: string;
  type: SailingType;
  site: string;
  notes: string;
  acceptedCrew: IUserData[];
  declinedCrew: IUserData[];
  eliminatedCrew: IUserData[]; // accepted crew that the snn publisher declined
  selectedCrew?: IUserData;
}

export interface Conversation {
  id: string;
  otherUser: IUserData;
  messages: ChatMessage[];
}

export interface ChatMessage {
  createdAt: Date;
  content: string;
  sender: IUserData;
  sentByMe: boolean;
  read: boolean;
}

export interface GroupedChatMessages {
  [day: string]: ChatMessage[]
}
