import {TableSortOps, Catalog} from './types';

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
