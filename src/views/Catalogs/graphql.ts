import {gql} from '@apollo/client';

export const FETCH_VENDORS = gql`
  query Vendors($offset: Int!) {
    vendors(limit: 20, offset: $offset) {
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
      }
    }
  }
`;
