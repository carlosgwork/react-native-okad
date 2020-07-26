import React from 'react';
import {TableHeaderType, TableSortOps} from '@utils/types';
import {Text, View} from 'react-native';

export const TEST_HEADERS: TableHeaderType[] = [
  {label: 'Id', value: 'id', sortable: true},
  {label: 'Contact', value: 'contact', sortable: true},
  {label: 'Created', value: 'created', sortable: true},
];

export const TEST_ROWS = [
  {
    id: 1,
    contact: 'John Doe',
    created: '2020-07-12',
  },
  {
    id: 2,
    contact: 'John Smith',
    created: '2020-07-11',
  },
  {
    id: 3,
    contact: 'James Doe',
    created: '2020-07-13',
  },
];

export const TEST_CELLS = (header: TableHeaderType, row: any) => {
  switch (header.value) {
    case 'id':
      return <Text>{row.id}</Text>;
    case 'contact':
      return <Text>{row.contact}</Text>;
    case 'created':
      return <Text>{row.creatd}</Text>;
    default:
      return <View />;
  }
};

export const TEST_SORTOPS: TableSortOps = {
  sortBy: 'id',
  sortOrder: 'ASC',
};
