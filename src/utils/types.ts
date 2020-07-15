import {ViewStyle} from 'react-native';

export type Address = {
  county?: string;
  city: string;
  us_state: string;
  id: number;
  line1: string;
  line2?: string;
  postal_code: string;
};

export type Agreement = {
  agreement_template_id: number;
  billing_address_id?: number;
  contact_id: number;
  created: Date;
  id: number;
  last_modified: Date;
  number: string;
  public_id: number;
  revision: number;
  sales_tax_rate: number;
  shipping_address_id?: number;
  signature?: number;
  user_id?: number;
};

export type Contact = {
  // contact_id: number,
  // public_id: string,
  // created: Date,
  // last_modified?: Date,
  email?: string;
  name_first: string;
  name_last: string;
  phone_mobile?: string;
  count?: number;
  phone_home?: string;
  phone_office?: string;
  address: Address;
  agreements: Agreement[];
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
