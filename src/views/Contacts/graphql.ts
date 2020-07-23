import gql from 'graphql-tag';

export const FETCH_CONTACTS = gql`
  query {
    contacts {
      id
      email
      name_first
      name_last
      phone_home
      phone_mobile
      phone_office
      address {
        county
        city
        us_state
      }
      agreements {
        id
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
        created
        company
        address {
          city
          line1
          line2
          us_state
          postal_code
        }
        phone_mobile
        phone_office
        name_first
        name_last
        title
      }
    }
  }
`;
