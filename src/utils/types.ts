import {ViewStyle} from 'react-native';

export type AgreementEventEnum =
  | 'printed'
  | 'emailed'
  | 'texted'
  | 'viewed'
  | 'modified'
  | 'accepted';

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
  events: AgreementEvent;
  contact?: Contact;
  address?: Address;
  addressByBillingAddressId?: Address;
};

export type AgreementEvent = {
  id: number;
  created: Date;
  agreement_id: number;
  type: AgreementEventEnum;
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
  agreements?: Agreement[];
  company?: string;
  title?: string;
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

export type Catalog = {
  id: number;
  public_id?: number;
  created?: Date;
  sku: string;
  name: string;
  description: string;
  category: string;
  cost: number;
  price: number;
  installation_fee: number;
  taxable: boolean;
  square_id?: string;
  qbo_id?: string;
};

export type CatalogKeys = keyof Catalog;

export type Vendor = {
  id: number;
  public_id: number;
  created: Date;
  last_modified: Date;
  name: string;
  short_name: string;
  logo_uri: string;
  catalog_items: Catalog[];
};

export type GeolocationParams = {
  lat: number;
  long: number;
};

export type TouchElementProps = {
  onPress: () => {};
};

export type LineItemType = {
  id: number;
  name: string;
  price: number;
  icon?: string;
  type?: string;
  category?: string;
  quantity?: number;
  color?: string;
};

export type ProductItemProps = {
  item: Catalog;
  index: number;
};
