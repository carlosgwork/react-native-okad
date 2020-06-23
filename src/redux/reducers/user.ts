import * as types from '@redux/actions/types'

type UserState = {
  name: string,
}

export const initialUser: UserState = {
  name: '',
}

export const user = (state: UserState = initialUser, action: UserAction) => {
  const { payload = {}, type } = action
  switch (type) {
    case 'clean_user':
      return initialUser
    case 'set_user':
      return { ...state, ...payload }

    case types.LOGOUT:
      return initialUser
    default:
      return state
  }
}

export type UserAction = { payload?: $Shape<UserState>, type: string }