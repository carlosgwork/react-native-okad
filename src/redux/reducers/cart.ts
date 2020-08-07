import {LineItemType} from '@root/utils/types';

export type CartState = {
  items: LineItemType[];
  error: string;
};

export const initialCart: {
  [_: string]: any;
} = {
  items: [],
  error: undefined,
};

const emptyPayload = {
  key: undefined,
};

export const cart = (
  state: {
    [_: string]: any;
  } = initialCart,
  action: CartAction,
) => {
  const {payload = emptyPayload, type} = action;
  switch (type) {
    case 'clean_cart':
      if (!payload.key) {
        return initialCart;
      } else {
        return {
          ...state,
          [payload.key]: initialCart[payload.key],
        };
      }
    case 'set_cart':
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export type CartAction = {
  payload?: Partial<{
    key: string | undefined;
    items: LineItemType[];
    error: string;
  }>;
  type: string;
};
