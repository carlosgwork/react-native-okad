import {ViewStyle} from 'react-native';

export type Contact = {
  // contact_id: number,
  // public_id: string,
  // created: Date,
  // last_modified?: Date,
  name_first?: string;
  name_last?: string;
  phone_mobile?: string;
  location?: string;
  count?: number;
  // phone_home?: string,
  // phone_office?: string,
  // more fields
};

export type TableHeaderType = {
  label: string;
  value: string;
  sortable?: boolean;
  style?: ViewStyle;
};

export type TableSortOps = {
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
};

export type UserType = {
  name: string;
};

export type ReduxState = {
  user: UserType;
};
