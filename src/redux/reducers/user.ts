
type UserState = {
  name: string,
}

export const initialToast: UserState = {
  name: '',
}

export const user = (state: UserState = initialToast, action: UserAction) => {
  const { payload = {}, type } = action
  switch (type) {
    case 'clean_user':
      return initialToast
    case 'set_user':
      return { ...state, ...payload }
    default:
      return state
  }
}

export type UserAction = { payload?: $Shape<UserState>, type: string }