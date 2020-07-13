import {toast, ToastState} from './reducers/toast';
import {user} from './reducers/user';
import {loading} from './reducers/loading';
import {contacts, ContactsState} from './reducers/contacts';
import {UserType} from '../utils/types';

export const reducers = {
  toast,
  user,
  loading,
  contacts,
};

export type ReducerKeys = keyof typeof reducers;

export type ReduxState = {
  toast: ToastState;
  user: UserType;
  loading: boolean;
  contacts: ContactsState;
};
