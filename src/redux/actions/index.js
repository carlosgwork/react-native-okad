import store from '@redux/store'
import { type ReducerKeys } from '@redux/reducers'

export const dispatch = store.dispatch

export const cleanAction = (reducer: ReducerKeys) => {
  dispatch({ type: 'clean_' + reducer })
}

export const setAction = (reducer: ReducerKeys, data: { [string]: any }) => {
  dispatch({ payload: data, type: 'set_' + reducer })
}
