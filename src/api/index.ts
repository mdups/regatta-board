import { IUserData, ISNN, Conversation, ChatMessage } from "../models";
import * as Sentry from '@sentry/react-native';
import { apiEnvironment } from "../utils/config_utils";

export interface APIReturnType<T> {
  result?: T;
  error?: string;
}

export const GENERAL_ERROR = "Network Error. Please try again."

export function handleError(response: Response, responseJSON: any): string | undefined {
  console.log(responseJSON)
  if (response.status !== 200) {
    if (responseJSON.error === "Internal Server Error") {
      return GENERAL_ERROR
    } else {
      return responseJSON.error
    }
  }
  return undefined;
}

export function reportError<T>(e: any): APIReturnType<T> {
  console.error(e);
  if (apiEnvironment() === "production") {
    Sentry.captureException(e);
  }
  return { error: e }
}

export function serializeUser(user: Partial<IUserData>): any {
  let obj = {
    ...user,
    sailing_types: user.sailingTypes,
    role: user.type,
  }

  delete obj.sailingTypes;
  delete obj.type;
  return obj;
}

export function deserializeUserFromAPI(json: any): IUserData {
  let obj = {
    ...json,
    sailingTypes: json.sailing_types,
    pushToken: json.push_token,
  }

  delete obj.push_token;
  delete obj.sailing_types;
  return obj;
}

export function serializeSNN(snn: Partial<ISNN>): any {
  let obj = {
    ...snn,
    boat_name: snn.boatName,
    boat_class: snn.boatClass,
    position_needed: snn.positionNeeded,
    report_time: snn.reportTime,
    sailing_type: snn.type
  }
  delete obj.boatName;
  delete obj.boatClass;
  delete obj.positionNeeded;
  delete obj.reportTime;
  delete obj.user;
  delete obj.type;
  delete obj.selectedCrew;
  delete obj.acceptedCrew;
  delete obj.declinedCrew;
  delete obj.eliminatedCrew;
  return obj;
}

export function deserializeSNNsFromAPI(json: any): ISNN[] {
  return json.map((j: any) => deserializeSNNFromAPI(j))
}

export function deserializeSNNFromAPI(json: any): ISNN {
  console.log(json)
  let obj = {
    ...json,
    boatName: json.boat_name,
    boatClass: json.boat_class,
    positionNeeded: json.position_needed,
    reportTime: new Date(json.report_time),
    sailingTypes: json.sailing_types,
    selectedCrew: json.selected_crew ? deserializeUserFromAPI(json.selected_crew) : null,
    acceptedCrew: json.accepted_crew ? json.accepted_crew.map((c: any) => deserializeUserFromAPI(c)) : [],
    declinedCrew: json.declined_crew ? json.declined_crew.map((c: any) => deserializeUserFromAPI(c)) : [],
    eliminatedCrew: json.eliminated_crew ? json.eliminated_crew.map((c: any) => deserializeUserFromAPI(c)) : [],
    user: json.user ? deserializeUserFromAPI(json.user) : null,
  }
  delete obj.boat_name;
  delete obj.boat_class;
  delete obj.position_needed;
  delete obj.report_time;
  delete obj.sailing_types;
  delete obj.selected_crew;
  delete obj.accepted_crew;
  delete obj.declined_crew;
  delete obj.eliminated_crew;
  return obj;
}

export function deserializeConversationsFromAPI(json: any): Conversation[] {
  return json.map((j: any) => deserializeConversationFromAPI(j))
}

export function deserializeConversationFromAPI(json: any): Conversation {
  let obj = {
    ...json,
    otherUser: deserializeUserFromAPI(json.other_user),
    messages: deserializeChatMessagesFromAPI(json.messages)
  }
  delete obj.other_user;
  return obj;
}

export function deserializeChatMessagesFromAPI(json: any): ChatMessage[] {
  return json.map((j: any) => deserializeChatMessageFromAPI(j))
}

export function deserializeChatMessageFromAPI(json: any): ChatMessage {
  let obj = {
    ...json,
    createdAt: new Date(json.created_at),
    sender: deserializeUserFromAPI(json.sender),
    sentByMe: json.sent_by_me,
  }
  delete obj.created_at;
  delete obj.sent_by_me;
  return obj;
}
