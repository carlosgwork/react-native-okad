import {gql} from '@apollo/client';

export const FETCH_AGREEMENTS = gql`
  query AgreementQuery($offset: Int!) {
    agreements(limit: 40, offset: $offset, order_by: {id: desc}) {
      id
      agreement_template_id
      agreement_events {
        type
        id
      }
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
        id
        order
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
      created
      last_modified
    }
  }
`;

export const CREATE_AGREEMENT = gql`
  mutation AddAgreement(
    $billing_address_id: Int
    $agreement_template_id: Int
    $contact_id: Int
    $shipping_address_id: Int
    $line_items: [line_items_insert_input!]!
    $user_id: Int
    $sales_tax_rate: numeric
    $number: citext!
  ) {
    insert_agreements(
      objects: {
        billing_address_id: $billing_address_id
        agreement_template_id: $agreement_template_id
        contact_id: $contact_id
        sales_tax_rate: $sales_tax_rate
        number: $number
        shipping_address_id: $shipping_address_id
        line_items: {data: $line_items}
        user_id: $user_id
      }
    ) {
      returning {
        id
        agreement_template_id
        agreement_events {
          type
          id
        }
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
  }
`;

export const UPDATE_AGREEMENT = gql`
  mutation UpdateAgreement($_set: agreements_set_input, $id: Int) {
    update_agreements(where: {id: {_eq: $id}}, _set: $_set) {
      returning {
        id
        agreement_template_id
        agreement_events {
          type
          id
        }
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
  }
`;

export const CREATE_LINE_ITEM = gql`
  mutation CreateLineItem($object: line_items_insert_input!) {
    insert_line_items_one(object: $object) {
      catalog_item_id
      agreement_id
      current_cost
      discount
      id
      order
      price
      qty
      taxable
      created
      last_modified
      catalog_item {
        name
      }
    }
  }
`;

export const UPDATE_LINE_ITEM = gql`
  mutation UpdateLineItem($_set: line_items_set_input, $id: Int) {
    update_line_items(where: {id: {_eq: $id}}, _set: $_set) {
      returning {
        id
      }
    }
  }
`;

export const REMOVE_LINE_ITEM = gql`
  mutation RemoveLineItem($id: Int) {
    delete_line_items(where: {id: {_eq: $id}}) {
      returning {
        id
      }
    }
  }
`;

export const GET_LAST_AGREEMENT_OF_USER = gql`
  query GetLastAgreementOfCurrentUser($user_id: Int) {
    agreements(
      limit: 1
      where: {user_id: {_eq: $user_id}}
      order_by: {id: desc}
    ) {
      id
      number
    }
  }
`;
