import {Catalog, TableSortOps} from '@utils/types';

export const initialCatalogs = {
  catalogs: [],
  sortOptions: [],
};

const emptyPayload = {
  key: undefined,
};

export const catalogs = (
  state: CatalogsState = initialCatalogs,
  action: CatalogsAction,
) => {
  const {payload = emptyPayload, type} = action;
  switch (type) {
    case 'clean_catalogs':
      return initialCatalogs;
    case 'set_catalogs':
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export type CatalogsAction = {
  payload?: Catalog[];
  type: string;
};

export type CatalogsState = {
  catalogs: Catalog[];
  sortOptions: SortOpsByVendor[];
};

export type SortOpsByVendor = {
  vendor_id: number;
  sortOps: TableSortOps;
};
