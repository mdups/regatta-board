import { API_BASE } from "./config";

export function apiEnvironment() {
  let env = '';
  if (API_BASE.includes("regatta-board.herokuapp.com")) {
    env = 'production'
  } else if (API_BASE.includes("regatta-board-qa.herokuapp.com")) {
    env = 'qa'
  } else {
    env = 'local'
  }

  const arr = API_BASE.split('/')
  let version = arr[arr.length - 2]

  return env + " " + version;
}
