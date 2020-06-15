
const initialState = {
  toast: { text: '', type: 'danger' },
}

export const global = (state: any = initialState, action: any) => {
  const { payload = {}, type } = action
  switch (type) {
    default:
      return state
  }
}