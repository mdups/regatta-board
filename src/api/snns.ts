import { API_BASE } from '../utils/config';
import { ISNN, IUserData } from '../models';
import {
  APIReturnType,
  handleError,
  deserializeSNNsFromAPI,
  deserializeSNNFromAPI,
  reportError,
} from '.';
import AsyncStorage from '@react-native-community/async-storage';

export const CREATE_SNN_ROUTE = API_BASE + 'snns';
export const UPDATE_SNN_ROUTE = API_BASE + 'snns';
export const SNNS_BY_USER_ROUTE = API_BASE + 'snns/by_user';
export const SNNS_ROUTE = API_BASE + 'snns';

export async function createSNN(
  snn: ISNN,
  bearerToken?: string,
): Promise<APIReturnType<ISNN>> {
  try {
    if (!bearerToken) {
      bearerToken =
        (await AsyncStorage.getItem('user_access_token')) || undefined;
    }
    const response = await fetch(CREATE_SNN_ROUTE, {
      method: 'POST',
      body: JSON.stringify({ snn: snn }),
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

    return { result: deserializeSNNFromAPI(responseJson) };
  } catch (e) {
    return reportError(e);
  }
}

export async function updateSNN(
  snn: ISNN,
  bearerToken?: string,
): Promise<APIReturnType<ISNN>> {
  try {
    if (!bearerToken) {
      bearerToken =
        (await AsyncStorage.getItem('user_access_token')) || undefined;
    }
    const response = await fetch(UPDATE_SNN_ROUTE + '/' + snn.id, {
      method: 'PATCH',
      body: JSON.stringify({ snn: snn }),
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

    return { result: deserializeSNNFromAPI(responseJson) };
  } catch (e) {
    return reportError(e);
  }
}

export async function getAllSNNsByUser(
  bearerToken?: string,
): Promise<APIReturnType<ISNN[]>> {
  try {
    if (!bearerToken) {
      bearerToken =
        (await AsyncStorage.getItem('user_access_token')) || undefined;
    }
    const response = await fetch(SNNS_BY_USER_ROUTE, {
      method: 'GET',
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

    return { result: deserializeSNNsFromAPI(responseJson) };
  } catch (e) {
    return reportError(e);
  }
}

export async function getAllSNNs(
  bearerToken?: string,
): Promise<APIReturnType<ISNN[]>> {
  try {
    if (!bearerToken) {
      bearerToken =
        (await AsyncStorage.getItem('user_access_token')) || undefined;
    }
    const response = await fetch(SNNS_ROUTE, {
      method: 'GET',
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

    return { result: deserializeSNNsFromAPI(responseJson) };
  } catch (e) {
    return reportError(e);
  }
}

export async function deleteSNN(
  snn: ISNN,
  bearerToken?: string,
): Promise<APIReturnType<string>> {
  try {
    if (!bearerToken) {
      bearerToken =
        (await AsyncStorage.getItem('user_access_token')) || undefined;
    }
    const response = await fetch(SNNS_ROUTE + `/${snn.id}`, {
      method: 'DELETE',
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

    return { result: '' };
  } catch (e) {
    return reportError(e);
  }
}

export async function selectCrew(
  snn: ISNN,
  user: IUserData,
  bearerToken?: string,
): Promise<APIReturnType<ISNN>> {
  return makeSelectionForCrew('select', snn, user, bearerToken);
}

export async function acceptCrew(
  snn: ISNN,
  user: IUserData,
  bearerToken?: string,
): Promise<APIReturnType<ISNN>> {
  return makeSelectionForCrew('accept', snn, user, bearerToken);
}

export async function declineCrew(
  snn: ISNN,
  user: IUserData,
  bearerToken?: string,
): Promise<APIReturnType<ISNN>> {
  return makeSelectionForCrew('decline', snn, user, bearerToken);
}

export async function eliminateCrew(
  snn: ISNN,
  user: IUserData,
  bearerToken?: string,
): Promise<APIReturnType<ISNN>> {
  return makeSelectionForCrew('eliminate', snn, user, bearerToken);
}

async function makeSelectionForCrew(
  selection: 'select' | 'accept' | 'decline' | 'eliminate',
  snn: ISNN,
  user: IUserData,
  bearerToken?: string,
): Promise<APIReturnType<ISNN>> {
  try {
    if (!bearerToken) {
      bearerToken =
        (await AsyncStorage.getItem('user_access_token')) || undefined;
    }
    const response = await fetch(
      SNNS_ROUTE + `/${snn.id}/${selection}_crew/${user.id}`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + bearerToken,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log(response);

    const responseJson = await response.json();

    const error = handleError(response, responseJson);
    if (error) {
      return { error: error };
    }

    return { result: deserializeSNNFromAPI(responseJson) };
  } catch (e) {
    return reportError(e);
  }
}
