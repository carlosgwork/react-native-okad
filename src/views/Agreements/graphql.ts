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
      }
    }
  }
`;
