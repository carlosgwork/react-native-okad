import store from '@redux/store'
import { ReducerKeys } from '@redux/reducers'


import * as types from './types'

export const dispatch = store.dispatch

export const cleanAction = (reducer: ReducerKeys, key?: string) => {
  dispatch({ type: 'clean_' + reducer, payload: { key } })
}

export const setAction = (reducer: ReducerKeys, data: { [string]: any }) => {
  dispatch({ payload: data, type: 'set_' + reducer })
}

// export const cleanPropAction = (reducer: ReducerKeys, key: string) => {
//   dispatch({ type: 'clean_prop_' + reducer, key })
// }

// export const setPropAction = (reducer: ReducerKeys, data: any, key: string) => {
//   dispatch({ payload: data, type: 'set_prop_' + reducer, key })
// }


export const logout = () => {
  dispatch({ type: types.LOGOUT })
}