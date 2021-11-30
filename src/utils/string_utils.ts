import { AccountType } from '../models';

export function humanizeAccountType(type?: AccountType): string {
  if (type === 'boat') {
    return 'Boat Owner';
  } else if (type === 'crew') {
    return 'Crew';
  }
  return '';
}

export function humanizeWord(word: string): string {
  return word.charAt(0).toUpperCase() + word.substring(1);
}
