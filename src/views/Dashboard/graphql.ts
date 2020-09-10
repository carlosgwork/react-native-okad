import {gql} from '@apollo/client';

export const FETCH_10_AGREEMENTS = gql`
  query AgreementsQuery($type: agreement_event!) {
    agreements(limit: 10, order_by: {created: desc}) {
      agreement_events(where: {type: {_neq: $type}}) {
        type
      }
      id
      agreement_template_id
      address {
        city
        county
        id
        line1
        line2
        us_state
        postal_code
      }
      addressByShippingAddressId {
        city
        county
        id
        line2
        line1
        us_state
        postal_code
      }
      contact {
        name_first
        name_last
        id
      }
      contact_id
      line_items {
        agreement_id
        catalog_item_id
        current_cost
        discount
        price
        qty
        order
        id
        taxable
        catalog_item {
          name
        }
      }
      number
      revision
      sales_tax_rate
      shipping_address_id
      signature
      user {
        prefix
        prefs
        public_id
        name_last
        name_first
        google_id
        email
        default_sales_tax_rate
        organization_id
      }
      user_id
    }
  }
`;
