import { API_BASE } from "../utils/config";
import { APIReturnType, handleError, reportError } from ".";

const LOGIN_ROUTE = API_BASE + 'authentication/login'
const SIGNUP_ROUTE = API_BASE + 'authentication/signup'
const RESET_PASSWORD_ROUTE = API_BASE + 'authentication/reset_password'

export async function login(email: string, password: string, pushToken?: string): Promise<APIReturnType<string>> {
  try {
    const response = await fetch(LOGIN_ROUTE, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password,
      })
    });

    if (response.status === 401) {
      return { error: 'Invalid Credentials' }
    }

    console.log(response);

    const responseJson = await response.json();

    const error = handleError(response, responseJson)
    if (error) {
      return { error: error }
    }

    return { result: responseJson.auth_token }
  } catch (e) {
    return reportError(e);
  }
}

export async function signup(email: string, password: string, pushToken: string): Promise<APIReturnType<string>> {
  try {
    const response = await fetch(SIGNUP_ROUTE, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password,
        push_token: pushToken,
      })
    });

    console.log(response);

    const responseJson = await response.json();

    const error = handleError(response, responseJson)
    if (error) {
      return { error: error }
    }

    return { result: responseJson.auth_token }
  } catch (e) {
    return reportError(e);
  }
}

export async function resetPassword(email: string, password: string): Promise<APIReturnType<string>> {
  try {
    const response = await fetch(RESET_PASSWORD_ROUTE, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password,
      })
    });

    console.log(response);

    const responseJson = await response.json();

    const error = handleError(response, responseJson)
    if (error) {
      return { error: error }
    }

    return { result: 'Success' }
  } catch (e) {
    return reportError(e);
  }
}
