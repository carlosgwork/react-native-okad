import { global } from './reducers/global'
import { toast, ToastState } from './reducers/toast'
import { user, UserState } from './reducers/user'
import { loading } from './reducers/loading'


export const reducers = {
  global,
  toast,
  user,
  loading,
}

export type ReducerKeys = $Keys<typeof reducers>

export type ReduxState = {
  toast: ToastState,
  user: UserState,
  loading: boolean
}