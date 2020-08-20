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
        id
        number
        line_items {
          discount
          price
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
