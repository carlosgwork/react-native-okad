import {TableSortOps} from '@utils/types';

export type AgreementsState = {
  agreements: [];
  sortOp: TableSortOps;
};

export const initialAgreements: {
  [_: string]: any;
} = {
  agreements: [],
  sortOp: {sortBy: 'phoneNumber', sortOrder: 'ASC'},
};

const emptyPayload = {
  key: undefined,
};

export const agreements = (
  state: {
    [_: string]: any;
  } = initialAgreements,
  action: AgreementsAction,
) => {
  const {payload = emptyPayload, type} = action;
  switch (type) {
    case 'clean_agreements':
      if (!payload.key) {
        return initialAgreements;
      } else {
        return {
          ...state,
          [payload.key]: initialAgreements[payload.key],
        };
      }
    case 'set_agreements':
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export type AgreementsAction = {
  payload?: {
    key: string | undefined;
    agreements: [];
    sortOp: TableSortOps;
  };
  type: string;
};
