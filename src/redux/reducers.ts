import {toast, ToastState} from './reducers/toast';
import {user} from './reducers/user';
import {loading} from './reducers/loading';
import {contacts, ContactsState} from './reducers/contacts';
import {catalogs, CatalogsState} from './reducers/catalogs';
import {vendors, VendorsState} from './reducers/vendors';
import {UserType} from '../utils/types';
import {agreements, AgreementsState} from './reducers/agreements';
import {cart, CartState} from './reducers/cart';
import {
  offline_mutations,
  offline_mutationsState,
} from './reducers/offline_mutations';
import {network, NetworkState} from './reducers/network';
import {
  agreement_templates,
  AgreementTemplatesState,
} from './reducers/agreement_templates';
import {sync, SyncState} from './reducers/sync';

export const reducers = {
  toast,
  user,
  loading,
  contacts,
  catalogs,
  vendors,
  agreements,
  cart,
  offline_mutations,
  network,
  agreement_templates,
  sync,
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
  cart: CartState;
  offline_mutations: offline_mutationsState;
  network: NetworkState;
  agreement_templates: AgreementTemplatesState;
  sync: SyncState;
};
