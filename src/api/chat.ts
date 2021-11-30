import { API_BASE } from "../utils/config";
import { APIReturnType, handleError, reportError, deserializeConversationsFromAPI, deserializeConversationFromAPI } from ".";
import { Conversation } from "../models";
import AsyncStorage from "@react-native-community/async-storage";

const MESSAGES_ROUTE = API_BASE + 'chat/messages'
const CREATE_CONVERSATION_ROUTE = API_BASE + 'chat/create_conversation'
const MARK_MESSAGES_AS_READ_ROUTE = API_BASE + 'chat/mark_messages_as_read'

export async function getConversations(bearerToken?: string): Promise<APIReturnType<Conversation[]>> {
  try {
    if (!bearerToken) {
      bearerToken = await AsyncStorage.getItem('user_access_token') || undefined;
    }
    const response = await fetch(MESSAGES_ROUTE, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + bearerToken, "Content-Type": "application/json" }
    });

    console.log(response);

    const responseJson = await response.json();

    const error = handleError(response, responseJson)
    if (error) {
      return { error: error }
    }

    return { result: deserializeConversationsFromAPI(responseJson) }
  } catch (e) {
    return reportError(e);
  }
}

export async function createConversation(otherUserId: string, bearerToken?: string): Promise<APIReturnType<Conversation>> {
  try {
    if (!bearerToken) {
      bearerToken = await AsyncStorage.getItem('user_access_token') || undefined;
    }
    const response = await fetch(CREATE_CONVERSATION_ROUTE, {
      method: 'POST',
      body: JSON.stringify({ user_id: otherUserId }),
      headers: { 'Authorization': 'Bearer ' + bearerToken, "Content-Type": "application/json" }
    });

    console.log(response);

    const responseJson = await response.json();

    const error = handleError(response, responseJson)
    if (error) {
      return { error: error }
    }

    return { result: deserializeConversationFromAPI(responseJson) }
  } catch (e) {
    return reportError(e);
  }
}

export async function markMessagesAsRead(conversationId: string, bearerToken?: string): Promise<APIReturnType<Conversation>> {
  try {
    if (!bearerToken) {
      bearerToken = await AsyncStorage.getItem('user_access_token') || undefined;
    }
    const response = await fetch(MARK_MESSAGES_AS_READ_ROUTE, {
      method: 'POST',
      body: JSON.stringify({ conversation_id: conversationId }),
      headers: { 'Authorization': 'Bearer ' + bearerToken, "Content-Type": "application/json" }
    });

    console.log(response);

    const responseJson = await response.json();

    const error = handleError(response, responseJson)
    if (error) {
      return { error: error }
    }

    return { result: deserializeConversationFromAPI(responseJson) }
  } catch (e) {
    return reportError(e);
  }
}
