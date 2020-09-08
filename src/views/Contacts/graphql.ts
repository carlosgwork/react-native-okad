import {gql} from '@apollo/client';

export const FETCH_CONTACTS = gql`
  query {
    contacts {
      id
      email
      name_first
      name_last
      title
      company
      phone_home
      phone_mobile
      phone_office
      address_id
      address {
        city
        lat
        id
        county
        line1
        line2
        postal_code
        us_state
      }
      agreements {
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

export const CREATE_CONTACT = gql`
  mutation AddContact(
    $company: citext!
    $email: String!
    $name_first: citext!
    $name_last: citext!
    $phone_mobile: String!
    $phone_office: String!
    $title: String!
    $city: citext!
    $line1: citext!
    $line2: citext!
    $postal_code: citext!
    $us_state: bpchar!
    $organization_id: Int
  ) {
    insert_contacts(
      objects: {
        email: $email
        name_first: $name_first
        name_last: $name_last
        phone_mobile: $phone_mobile
        phone_office: $phone_office
        title: $title
        organization_id: $organization_id
        address: {
          data: {
            city: $city
            line1: $line1
            line2: $line2
            postal_code: $postal_code
            us_state: $us_state
          }
        }
        company: $company
      }
    ) {
      returning {
        id
        email
        name_first
        name_last
        title
        company
        phone_home
        phone_mobile
        phone_office
        address_id
        address {
          city
          lat
          id
          county
          line1
          line2
          postal_code
          us_state
        }
        agreements {
          id
          number
          line_items {
            discount
            price
            order
            qty
          }
          sales_tax_rate
          created
          agreement_template_id
          user {
            email
            id
            prefix
          }
        }
      }
    }
  }
`;
