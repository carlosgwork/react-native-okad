import {TableSortOps} from '@utils/types';

export type ContactsState = {
  contacts: [];
  sortOp: TableSortOps;
};

export const initialContacts: {
  [_: string]: any;
} = {
  contacts: [],
  sortOp: {sortBy: 'phoneNumber', sortOrder: 'ASC'},
};

const emptyPayload = {
  key: undefined,
};

export const contacts = (
  state: {
    [_: string]: any;
  } = initialContacts,
  action: ContactsAction,
) => {
  const {payload = emptyPayload, type} = action;
  switch (type) {
    case 'clean_contacts':
      if (!payload.key) {
        return initialContacts;
      } else {
        return {
          ...state,
          [payload.key]: initialContacts[payload.key],
        };
      }
    case 'set_contacts':
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export type ContactsAction = {
  payload?: {
    key: string | undefined;
    contacts: [];
    sortOp: TableSortOps;
  };
  type: string;
};
