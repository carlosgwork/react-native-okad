
export const initialLoading = false

export const loading = (state: boolean = initialLoading, action: LoadingAction) => {
  const { payload = false, type } = action
  switch (type) {
    case 'clean_loading':
      return initialLoading
    case 'set_loading':
      return payload
    default:
      return state
  }
}

export type LoadingAction = { payload?: boolean, type: string }