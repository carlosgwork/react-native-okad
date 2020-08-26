export const CONTACT_DETAILS_MOCKDATA = {
  id: 1,
  email: 'alana.nitzsche44@gmail.com',
  name_first: 'Irving',
  name_last: 'Marvin',
  title: 'Mrs.',
  company: 'Jacobs LLC',
  phone_home: '+18581950948',
  phone_mobile: '+18653374781',
  phone_office: null,
  address_id: 7,
  address: {
    city: 'Andersonhaven',
    lat: null,
    id: 7,
    county: null,
    line1: '0558 Jacobi Street',
    line2: 'Apt 4A',
    postal_code: '49001',
    us_state: 'AR',
  },
  agreements: [
    {
      id: 10,
      number: 'PF3057',
      line_items: [
        {
          discount: 20000,
          price: 496279,
          qty: 1,
        },
        {
          discount: 20000,
          price: 531804,
          qty: 1,
        },
      ],
      sales_tax_rate: 8.5,
      created: '2020-07-31T23:26:50.479677+00:00',
      agreement_template_id: 1,
      user: {
        email: 'winona.harber@hotmail.com',
        id: 9,
        prefix: 'PK',
      },
    },
  ],
};
