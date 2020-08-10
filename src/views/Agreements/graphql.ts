import {gql} from '@apollo/client';

export const CREATE_AGREEMENT = gql`
  mutation AddAgreement(
    $billing_address_id: Int
    $agreement_template_id: Int
    $contact_id: Int
    $shipping_address_id: Int
    $line_items: [line_items_insert_input!]!
  ) {
    insert_agreements(
      objects: {
        billing_address_id: $billing_address_id
        agreement_template_id: $agreement_template_id
        contact_id: $contact_id
        sales_tax_rate: 0
        number: ""
        shipping_address_id: $shipping_address_id
        line_items: {data: $line_items}
      }
    ) {
      returning {
        id
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
        contact_id
        line_items {
          agreement_id
          catalog_item_id
          current_cost
          discount
          price
          qty
          id
          catalog_item {
            name
          }
        }
        number
        revision
        sales_tax_rate
        shipping_address_id
        signature
      }
    }
  }
`;
