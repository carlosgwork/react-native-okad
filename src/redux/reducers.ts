import { toast, ToastState } from './reducers/toast'
import { user, UserState } from './reducers/user'
import { loading } from './reducers/loading'
import { contacts, ContactsState, ContactsAction } from './reducers/contacts'


export const reducers = {
  toast,
  user,
  loading,
  contacts,
}

export type ReducerKeys = $Keys<typeof reducers>

export type ReduxState = {
  toast: ToastState,
  user: UserState,
  loading: boolean,
  contacts: ContactsState,
}