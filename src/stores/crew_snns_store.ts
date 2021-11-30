import { runInAction, makeAutoObservable } from 'mobx';
import { computedFn } from 'mobx-utils';
import { ISNN, SailingType, IUserData } from '../models';
import { acceptCrew, declineCrew, getAllSNNs } from '../api/snns';

export class CrewSNNSStore {
  isLoading: boolean = false;
  isRefreshing: boolean = false;
  error: string = '';
  snns?: ISNN[] = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  reset = () => {
    this.isLoading = false;
    this.isRefreshing = false;
    this.error = '';
    this.snns = undefined;
  };

  get shouldFetch() {
    return !this.isLoading && !this.isRefreshing && !this.snns;
  }

  snnsAtLocation = computedFn(function snnsAtLocation(
    location?: string,
    sailingTypes?: SailingType[],
  ): ISNN[] {
    //@ts-ignore
    var result = this.snns;
    if (location) {
      result = result.filter((s: ISNN) => s.location === location);
    }
    if (sailingTypes) {
      result = result.filter((s: ISNN) => sailingTypes.includes(s.type));
    }
    return result;
  });

  fetchAllSNNS = async (fromRefresh: boolean = false) => {
    if (fromRefresh) {
      this.isRefreshing = true;
    } else {
      this.isLoading = true;
    }
    this.error = '';

    const { result, error } = await getAllSNNs();
    if (error) {
      runInAction(() => {
        this.isLoading = false;
        this.isRefreshing = false;
        this.error = error;
      });
    }
    if (result) {
      runInAction(() => {
        this.isLoading = false;
        this.isRefreshing = false;
        this.snns = result;
      });
    }
  };

  handleAccept = async (snn: ISNN, user: IUserData) => {
    acceptCrew(snn, user).then((response) => {
      const { result, error } = response;
      if (error) {
        runInAction(() => {
          this.error = error;
          this.isLoading = false;
          this.isRefreshing = false;
        });
      }
      if (result) {
        runInAction(() => {
          this.error = '';
          this.isLoading = false;
          this.isRefreshing = false;
          const index = this.snns!.findIndex((s) => s.id === snn.id);
          this.snns![index] = result;
        });
      }
    });
  };

  handleDecline = async (snn: ISNN, user: IUserData) => {
    declineCrew(snn, user).then((response) => {
      const { result, error } = response;
      if (error) {
        runInAction(() => {
          this.error = error;
          this.isLoading = false;
          this.isRefreshing = false;
        });
      }
      if (result) {
        runInAction(() => {
          this.error = '';
          this.isLoading = false;
          this.isRefreshing = false;
          const index = this.snns!.findIndex((s) => s.id === snn.id);
          this.snns![index] = result;
        });
      }
    });
  };
}

export const crewSNNSStore = new CrewSNNSStore();
