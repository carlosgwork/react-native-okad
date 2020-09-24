export type SyncState = {
  status: boolean;
  loading: boolean;
};

export const initialData: SyncState = {
  status: false,
  loading: true,
};

export const sync = (state: SyncState = initialData, action: SyncAction) => {
  const {payload = {}, type} = action;
  switch (type) {
    case 'clean_sync':
      return initialData;
    case 'set_sync':
      return {...state, ...payload};

    default:
      return state;
  }
};

export type SyncAction = {payload?: Partial<SyncState>; type: string};
