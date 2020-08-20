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
  lat?: number;
  long?: number;
};

export type Agreement = {
  agreement_template_id: number;
  billing_address_id?: number;
  contact_id: number;
  created: Date;
  id: number;
  last_modified: Date;
  number: string;
  public_id?: number;
  revision: number;
  sales_tax_rate: number;
  shipping_address_id?: number;
  signature?: string;
  user_id?: number;
  events?: AgreementEvent;
  contact?: Contact;
  address?: Address;
  addressByShippingAddressId?: Address;
  line_items?: AgreementLineItemType[];
  agreement_events?: AgreementEvent[] | AgreementEvent;
  user?: UserType;
  amount?: number;
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
  id: number;
  email?: string;
  name_first: string;
  name_last: string;
  phone_mobile?: string;
  count?: number;
  phone_home?: string;
  phone_office?: string;
  address_id: number;
  address: Address;
  agreements?: Agreement[];
  offlineAgreements?: number[];
  company?: string;
  title?: string;
  user?: UserType;
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
  lastAgreementNumber: number;
  deleted: boolean;
  default_sales_tax_rate: number;
  created: Date;
  email: string;
  google_id?: string;
  id: number;
  last_modified?: Date;
  name_first: string;
  name_last: string;
  organization_id: number;
  prefix: string;
  public_id?: string;
  pres?: any;
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
  cost: number;
  price: number;
  icon?: string;
  type?: string;
  category?: string;
  qty?: number;
  color?: string;
  taxable: boolean;
  subcategory: string;
};

export type AgreementLineItemType = {
  id: number;
  name: string;
  agreement_id: number;
  catalog_item_id: number;
  current_cost: number;
  discount: number;
  price: number;
  qty: number;
  catalog_item: any;
};

export type ProductItemProps = {
  item: Catalog;
  index: number;
};

export type OfflineMutationType = {
  type: string;
  itemId: number;
};
