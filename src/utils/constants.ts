import {TableSortOps, Catalog, Contact} from './types';

export const emptyTableSortOption: TableSortOps = {
  sortOrder: 'ASC',
  sortBy: '',
};

export const emptyCatalog: Catalog = {
  sku: '',
  name: '',
  description: '',
  category: '',
  cost: 0,
  price: 0,
  installation_fee: 0,
  taxable: false,
  id: 0,
};

export const emptyContact: Contact = {
  name_first: '',
  name_last: '',
  address: {
    city: '',
    us_state: '',
    postal_code: '',
    line1: '',
    id: 0,
  },
};
