import {gql} from '@apollo/client';

export const FETCH_ALL_VENDORS = gql`
  query Vendors {
    vendors {
      id
      logo_uri
      name
      short_name
      catalog_items {
        cost
        id
        price
        sku
        taxable
        name
        description
        category
        created
        installation_fee
        public_id
        qbo_id
        square_id
      }
    }
  }
`;

export const FETCH_ALL_CATALOGS = gql`
  query Catalogs {
    catalog_items {
      cost
      id
      price
      sku
      taxable
      name
      description
      category
      created
      installation_fee
      public_id
      qbo_id
      square_id
      vendor_id
    }
  }
`;
