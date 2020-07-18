import {toast, ToastState} from './reducers/toast';
import {user} from './reducers/user';
import {loading} from './reducers/loading';
import {contacts, ContactsState} from './reducers/contacts';
import {catalogs, CatalogsState} from './reducers/catalogs';
import {vendors, VendorsState} from './reducers/vendors';
import {UserType} from '../utils/types';
import {agreements, AgreementsState} from './reducers/agreements';

export const reducers = {
  toast,
  user,
  loading,
  contacts,
  catalogs,
  vendors,
  agreements,
};

export type ReducerKeys = keyof typeof reducers;

export type ReduxState = {
  toast: ToastState;
  user: UserType;
  loading: boolean;
  contacts: ContactsState;
  catalogs: CatalogsState;
  vendors: VendorsState;
  agreements: AgreementsState;
};
