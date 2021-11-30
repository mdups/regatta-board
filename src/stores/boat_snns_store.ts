import { runInAction, makeAutoObservable } from 'mobx';
import { IUserData, ISNN } from '../models';
import { enableLogging } from 'mobx-logger';
import {
  getAllSNNsByUser,
  deleteSNN,
  selectCrew,
  eliminateCrew,
  createSNN,
  updateSNN,
} from '../api/snns';
import { serializeSNN } from '../api';

// enableLogging({ action: true, compute: true });

export class BoatSNNSStore {
  isLoading: boolean = false;
  isRefreshing: boolean = false;
  error: string = '';
  snns?: ISNN[] = undefined; // only from current user (boat owner)

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

  fetchAllSNNSForUser = async (fromRefresh: boolean = false) => {
    if (fromRefresh) {
      this.isRefreshing = true;
    } else {
      this.isLoading = true;
    }
    this.error = '';

    const { result, error } = await getAllSNNsByUser();
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

  deleteSNN = async (snn: ISNN) => {
    const { error } = await deleteSNN(snn);
    if (error) {
      runInAction(() => {
        this.error = error;
      });
    } else {
      runInAction(() => {
        this.snns = this.snns!.filter((s) => s.id != snn.id);
      });
    }
  };

  handleSelectCrew = async (snn: ISNN, item: IUserData) => {
    const { result, error } = await selectCrew(snn, item);
    if (error) {
      runInAction(() => {
        this.error = error;
      });
    }
    if (result) {
      runInAction(() => {
        const index = this.snns!.findIndex((s) => s.id === snn.id);
        this.snns![index] = result;
      });
    }
  };

  handleDeclineCrew = async (snn: ISNN, user: IUserData) => {
    const { result, error } = await eliminateCrew(snn, user);
    if (error) {
      runInAction(() => {
        this.error = error;
      });
    }
    if (result) {
      runInAction(() => {
        const index = this.snns!.findIndex((s) => s.id === snn.id);
        this.snns![index] = result;
      });
    }
  };

  createSNN = async (
    snn: Partial<ISNN>,
    reportDate?: Date,
    reportTime?: Date,
    userHomeTown?: string,
  ) => {
    this.isLoading = true;
    this.error = '';
    // error validation
    if (
      !snn.boatName ||
      !snn.boatClass ||
      !snn.positionNeeded ||
      !snn.location ||
      !snn.site ||
      !reportDate ||
      !reportTime
    ) {
      this.isLoading = false;
      this.error = 'Not all required fields are filled';
      return;
    }

    const snnCopy: ISNN = JSON.parse(JSON.stringify(snn));
    snnCopy.reportTime = new Date(
      reportDate.getFullYear(),
      reportDate.getMonth(),
      reportDate.getDate(),
      reportTime.getHours(),
      reportTime.getMinutes(),
    );
    const { result, error } = await createSNN(serializeSNN(snnCopy));
    if (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error;
      });
    }
    if (result) {
      runInAction(() => {
        this.isLoading = false;
        this.error = '';
        this.snns = this.snns ? [...this.snns, result] : [result];
      });
    }
  };

  updateSNN = async (
    snn: Partial<ISNN>,
    reportDate?: Date,
    reportTime?: Date,
    userHomeTown?: string,
  ) => {
    this.isLoading = true;
    this.error = '';
    // error validation
    if (
      !snn.boatName ||
      !snn.boatClass ||
      !snn.positionNeeded ||
      !snn.location ||
      !snn.site ||
      !reportDate ||
      !reportTime
    ) {
      this.isLoading = false;
      this.error = 'Not all required fields are filled';
      return;
    }

    const snnCopy: ISNN = JSON.parse(JSON.stringify(snn));
    snnCopy.reportTime = new Date(
      reportDate.getFullYear(),
      reportDate.getMonth(),
      reportDate.getDate(),
      reportTime.getHours(),
      reportTime.getMinutes(),
    );
    const { result, error } = await updateSNN(serializeSNN(snnCopy));
    if (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error;
      });
    }
    if (result) {
      runInAction(() => {
        this.isLoading = false;
        this.error = '';
        // this.snns = this.snns ? [...this.snns, result] : [result]
        const index = this.snns?.findIndex((v) => v.id === result.id);

        if (index !== undefined) {
          this.snns![index] = result;
        } else {
          console.warn('Index could not be found for updating an SNN');
        }
      });
    }
  };
}

export const boatSNNSStore = new BoatSNNSStore();
