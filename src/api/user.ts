import { API_BASE } from '../utils/config';
import {
  APIReturnType,
  handleError,
  deserializeUserFromAPI,
  reportError,
} from '.';
import { IUserData } from '../models';
import AsyncStorage from '@react-native-community/async-storage';

const UPDATE_USER_ROUTE = API_BASE + 'user';
const GET_USER_ROUTE = API_BASE + 'user';

export async function updateUser(
  user: any,
  bearerToken?: string,
): Promise<APIReturnType<IUserData>> {
  try {
    if (!bearerToken) {
      bearerToken =
        (await AsyncStorage.getItem('user_access_token')) || undefined;
    }
    const response = await fetch(UPDATE_USER_ROUTE, {
      method: 'PATCH',
      body: JSON.stringify({ user: user }),
      headers: {
        Authorization: 'Bearer ' + bearerToken,
        'Content-Type': 'application/json',
      },
    });

    console.log(response);

    const responseJson = await response.json();

    const error = handleError(response, responseJson);
    if (error) {
      return { error: error };
    }

    return { result: deserializeUserFromAPI(responseJson) };
  } catch (e) {
    return reportError(e);
  }
}

export async function getCurrentUser(
  bearerToken?: string,
): Promise<APIReturnType<IUserData>> {
  try {
    if (!bearerToken) {
      bearerToken =
        (await AsyncStorage.getItem('user_access_token')) || undefined;
    }
    const response = await fetch(GET_USER_ROUTE, {
      headers: { Authorization: 'Bearer ' + bearerToken },
    });

    console.log(bearerToken);

    console.log(response);

    const responseJson = await response.json();

    const error = handleError(response, responseJson);
    if (error) {
      return { error: error };
    }

    return { result: deserializeUserFromAPI(responseJson) };
  } catch (e) {
    return reportError(e);
  }
}
