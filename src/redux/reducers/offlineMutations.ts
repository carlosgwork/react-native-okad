import {OfflineMutationType} from '@root/utils/types';

export type OfflineMutationsState = {
  data: OfflineMutationType[];
  active: boolean;
};

export const initialOfflineMutation: {
  [_: string]: any;
} = {
  data: [],
  active: false,
};

const emptyPayload = {
  key: undefined,
};

export const offlineMutations = (
  state: {
    [_: string]: any;
  } = initialOfflineMutation,
  action: OfflineMutationAction,
) => {
  const {payload = emptyPayload, type} = action;
  switch (type) {
    case 'clean_offlineMutations':
      if (!payload.key) {
        return initialOfflineMutation;
      } else {
        return {
          ...state,
          [payload.key]: initialOfflineMutation[payload.key],
        };
      }
    case 'set_offlineMutations':
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export type OfflineMutationAction = {
  payload?: Partial<{
    key: string | undefined;
    data: OfflineMutationType[];
    active: boolean;
  }>;
  type: string;
};
