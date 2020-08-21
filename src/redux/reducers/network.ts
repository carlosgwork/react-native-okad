export type NetworkState = {
  online: boolean;
};

export const initialNetwork: {
  [_: string]: any;
} = {
  online: true,
};

const emptyPayload = {
  key: undefined,
};

export const network = (
  state: {
    [_: string]: any;
  } = initialNetwork,
  action: NetworkAction,
) => {
  const {payload = emptyPayload, type} = action;
  switch (type) {
    case 'clean_network':
      if (!payload.key) {
        return initialNetwork;
      } else {
        return {
          ...state,
          [payload.key]: initialNetwork[payload.key],
        };
      }
    case 'set_network':
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export type NetworkAction = {
  payload?: Partial<{
    key: string | undefined;
    online: boolean;
  }>;
  type: string;
};
