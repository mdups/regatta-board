import { runInAction, makeAutoObservable } from 'mobx';
import { enableLogging } from 'mobx-logger';
import { getLocations } from '../api/locations';

enableLogging({ action: true, compute: true });

export class LocationsStore {
  isLoading: boolean = false;
  error: string = '';
  locations?: string[] = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  reset = () => {
    this.isLoading = false;
    this.error = '';
    this.locations = undefined;
  };

  get shouldFetch(): boolean {
    return !this.isLoading && !this.locations;
  }

  async fetchLocations() {
    this.isLoading = true;
    this.error = '';
    const { result, error } = await getLocations();
    if (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error;
      });
    }
    if (result) {
      runInAction(() => {
        this.isLoading = false;
        this.locations = result;
      });
    }
  }
}

export const locationsStore = new LocationsStore();
