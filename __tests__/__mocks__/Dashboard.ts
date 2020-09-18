export const DASHBOARD_MOCKDATA = {
  agreements: [
    {
      id: 1004,
      agreement_template_id: 1,
      agreement_events: [
        {
          type: 'texted',
          id: 894,
        },
      ],
      address: {
        city: 'Cyrustown',
        county: null,
        id: 11,
        line1: '401 Aglae Expressway',
        line2: null,
        us_state: 'MA',
        postal_code: '64195',
      },
      addressByShippingAddressId: {
        city: 'Cyrustown',
        county: null,
        id: 11,
        line2: null,
        line1: '401 Aglae Expressway',
        us_state: 'MA',
        postal_code: '64195',
      },
      contact: {
        name_first: 'Clovis',
        name_last: 'Zulauf',
        id: 6,
      },
      contact_id: 6,
      line_items: [
        {
          agreement_id: 1004,
          catalog_item_id: 1,
          current_cost: 155000,
          discount: 0,
          price: 270000,
          qty: 1,
          id: 1093,
          order: null,
          taxable: true,
          catalog_item: {
            name: 'Elan SRE-3050',
          },
        },
        {
          agreement_id: 1004,
          catalog_item_id: 7,
          current_cost: 36740,
          discount: 0,
          price: 72900,
          qty: 1,
          id: 1094,
          order: null,
          taxable: true,
          catalog_item: {
            name: 'Power-Assisted Swivel Seat',
          },
        },
      ],
      number: '3',
      revision: 0,
      sales_tax_rate: 8,
      shipping_address_id: 11,
      signature: null,
      user: {
        prefix: 'LH',
        prefs: {
          passcode: null,
        },
        public_id: '8d806ff5-0c68-430c-956d-42f2f3dd3d87',
        name_last: 'Hermann',
        name_first: 'Lacy',
        google_id: null,
        email: 'elisha61@hotmail.com',
        default_sales_tax_rate: 8,
        organization_id: 1,
      },
      user_id: 1,
      created: '2020-09-05T22:21:09.024666+00:00',
      last_modified: '2020-09-18T11:33:52.536939+00:00',
      agreement_template: {
        name: 'Bruno Straight Stairlift',
        opts: {
          color: 'rgb(200, 170, 10)',
          payment_schedule: [
            {
              type: 'percentage',
              value: 0.1,
              description: 'Deposit',
            },
            {
              type: 'percentage',
              value: 0.9,
              description: 'Balance due upon installation',
            },
          ],
        },
        id: 1,
      },
    },
    {
      id: 1003,
      agreement_template_id: 1,
      agreement_events: [
        {
          type: 'texted',
          id: 893,
        },
      ],
      address: {
        city: 'Andersonhaven',
        county: null,
        id: 7,
        line1: '0558 Jacobi Street',
        line2: 'Apt 4A',
        us_state: 'AR',
        postal_code: '49001',
      },
      addressByShippingAddressId: {
        city: 'Andersonhaven',
        county: null,
        id: 7,
        line2: 'Apt 4A',
        line1: '0558 Jacobi Street',
        us_state: 'AR',
        postal_code: '49001',
      },
      contact: {
        name_first: 'Irving',
        name_last: 'Marvin',
        id: 1,
      },
      contact_id: 1,
      line_items: [
        {
          agreement_id: 1003,
          catalog_item_id: 1,
          current_cost: 155000,
          discount: 10000,
          price: 270000,
          qty: 1,
          id: 1092,
          order: null,
          taxable: true,
          catalog_item: {
            name: 'Elan SRE-3050',
          },
        },
      ],
      number: '2',
      revision: 0,
      sales_tax_rate: 8,
      shipping_address_id: 7,
      signature: null,
      user: {
        prefix: 'LH',
        prefs: {
          passcode: null,
        },
        public_id: '8d806ff5-0c68-430c-956d-42f2f3dd3d87',
        name_last: 'Hermann',
        name_first: 'Lacy',
        google_id: null,
        email: 'elisha61@hotmail.com',
        default_sales_tax_rate: 8,
        organization_id: 1,
      },
      user_id: 1,
      created: '2020-09-05T22:08:46.032359+00:00',
      last_modified: null,
      agreement_template: {
        name: 'Bruno Straight Stairlift',
        opts: {
          color: 'rgb(200, 170, 10)',
          payment_schedule: [
            {
              type: 'percentage',
              value: 0.1,
              description: 'Deposit',
            },
            {
              type: 'percentage',
              value: 0.9,
              description: 'Balance due upon installation',
            },
          ],
        },
        id: 1,
      },
    },
  ],
};

export const TILE_MOCKDATA = {
  agreement: {
    created: '2020-06-22T18:24:12.124733+00:00',
    agreement_template_id: 1,
    number: 'PF8848',
    last_modified: null,
    id: 1,
    public_id: 'de5f7e28-e25e-4c03-b50c-1342fd6721a1',
    addressByBillingAddressId: {
      city: 'Andersonhaven',
      us_state: 'AR',
    },
    contact: {
      name_last: 'Lindgren',
      name_first: 'Linnie',
    },
    address: {
      city: 'New Barrettport',
      us_state: 'MT',
    },
  },
  color: '#ababab',
};
