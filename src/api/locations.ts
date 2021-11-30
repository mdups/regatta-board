import { handleError, APIReturnType, reportError } from ".";
import { API_BASE } from "../utils/config";

const LOCATIONS_ROUTE = API_BASE + 'locations'

export async function getLocations(): Promise<APIReturnType<string[]>> {
  try {
    const response = await fetch(LOCATIONS_ROUTE, {
      method: 'GET',
      headers: { "Content-Type": "application/json"}
    });

    console.log(response);

    const responseJson = await response.json();

    const error = handleError(response, responseJson)
    if (error) {
      return { error: error }
    }

    return { result: responseJson.locations }
  } catch (e) {
    return reportError(e);
  }
}
