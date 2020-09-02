import {Vendor, TableSortOps} from '@utils/types';

export const initialVendors = {
  vendors: [],
  searchText: '',
  sortOptions: [],
};

const emptyPayload = {
  key: undefined,
};

export const vendors = (
  state: VendorsState = initialVendors,
  action: VendorsAction,
) => {
  const {payload = emptyPayload, type} = action;
  switch (type) {
    case 'clean_vendors':
      return initialVendors;
    case 'set_vendors':
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export type VendorsAction = {
  payload?: Vendor[];
  type: string;
};

export type VendorsState = {
  vendors: Vendor[];
  searchText: string;
  sortOptions: SortOpsByVendor[];
};

export type SortOpsByVendor = {
  vendor_id: number;
  sortOps: TableSortOps;
};
