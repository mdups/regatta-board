import { runInAction, makeAutoObservable } from 'mobx';
import { IUserData, AccountType, SailingType } from '../models';
import { login, signup } from '../api/authentication';
import { getCurrentUser, updateUser } from '../api/user';
import AsyncStorage from '@react-native-community/async-storage';
import { serializeUser } from '../api';
import messaging from '@react-native-firebase/messaging';

export class UserStore {
  isLoading: boolean = false;
  error: string = '';
  user?: IUserData = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  get shouldFetch(): boolean {
    return !this.isLoading && !this.user;
  }

  get shouldSetPushToken(): boolean {
    return !!this.user && !!this.user.pushToken;
  }

  setPushToken = async (bearerToken?: string) => {
    const pushToken = await messaging().getToken();

    const { result, error } = await updateUser(
      {
        push_token: pushToken,
      },
      bearerToken,
    );

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
        this.user = result;
      });
    }
  };

  getCurrentUser = async (bearerToken?: string) => {
    this.isLoading = true;
    this.error = '';
    const { result, error } = await getCurrentUser(bearerToken);
    if (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = error;
      });
    } else if (result) {
      runInAction(() => {
        this.isLoading = false;
        this.user = result;
        this.error = '';
      });
    } else {
      runInAction(() => {
        this.isLoading = false;
        this.error =
          "Error fetching user data. Please try again. If you haven't created an account yet, please sign up instead.";
      });
    }
  };

  handleLogin = async (
    email: string,
    password: string,
    onSuccess: () => void,
  ) => {
    this.isLoading = true;
    this.error = '';

    if (!password || password.length === 0) {
      this.isLoading = false;
      this.error =
        'The provided password is invalid. Please provide a valid password.';
      return;
    }

    const { result, error } = await login(email, password);

    if (result) {
      runInAction(async () => {
        this.isLoading = false;
        this.error = '';
        await AsyncStorage.setItem('user_access_token', result);
        onSuccess();
      });
    }

    console.log('error', error);
    if (error) {
      runInAction(() => {
        this.error = error;
        this.isLoading = false;
      });
    }
  };

  handleSignUp = async (
    email: string,
    password: string,
    onSuccess: () => void,
  ) => {
    this.isLoading = true;
    this.error = '';

    if (!password || password.length === 0) {
      this.isLoading = false;
      this.error =
        'The provided password is invalid. Please provide a valid password.';
      return;
    }

    if (password.length < 7) {
      this.isLoading = false;
      this.error = 'The provided password is too short.';
      return;
    }

    const pushToken = await messaging().getToken();

    const { result, error } = await signup(email, password, pushToken);

    if (result) {
      runInAction(async () => {
        this.isLoading = false;
        this.error = '';
        await AsyncStorage.setItem('user_access_token', result);
        onSuccess();
      });
    }

    if (error) {
      runInAction(() => {
        this.error = error;
        this.isLoading = false;
      });
    }
  };

  saveUser = async ({
    name,
    hometown,
    experience,
    weight,
    type,
    sailingTypes,
    age,
    gender,
    avaliable,
  }: {
    name: string;
    hometown: string;
    weight?: string;
    experience?: string;
    type: AccountType;
    sailingTypes?: SailingType[];
    age?: number;
    gender?: string;
    avaliable: boolean;
  }) => {
    this.isLoading = true;
    this.error = '';

    const { result, error } = await updateUser(
      serializeUser({
        name: name,
        hometown: hometown,
        experience: experience,
        weight: weight,
        type: type,
        sailingTypes: sailingTypes,
        age: age,
        gender: gender,
        avaliable: avaliable
      }),
    );

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
        this.user = result;
      });
    }
  };
  
  toggleAvaliability = async () => {
    this.isLoading = true;
    this.error = '';
    const { result, error } = await updateUser(
      serializeUser({
        ...this.user,
        avaliable: !this.user?.avaliable,
      }),
    );

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
        this.user = result;
      });
    }
  };

  updateUserHometown = async (hometown?: string) => {
    if (!hometown) {
      return;
    }

    this.isLoading = true;
    this.error = '';

    const { result, error } = await updateUser(
      serializeUser({
        ...this.user,
        hometown: hometown,
      }),
    );

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
        this.user = result;
      });
    }
  };

  logout = async () => {
    await updateUser(
      serializeUser({
        pushToken: null,
      }),
    );
    this.error = '';
    this.isLoading = false;
    this.user = undefined;
  };

  clearError = () => {
    this.error = '';
  };
}

export const userStore = new UserStore();
