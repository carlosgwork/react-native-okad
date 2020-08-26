/**
 * @jest-environment jsdom
 */

import React from 'react';
import {Alert} from 'react-native';
import {Provider} from 'react-redux';
import {createMockClient} from 'mock-apollo-client';
import {ApolloProvider} from '@apollo/client';
import {mount, ReactWrapper} from 'enzyme';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import configureStore from 'redux-mock-store';
import AgreementDetails from '@root/views/Agreements/Details';

import {AGREEMENT_DETAILS_MOCKDATA} from '../../__mocks__/AgreementDetails';
import {CONTACT_DETAILS_MOCKDATA} from '../../__mocks__/ContactDetails';

let wrapper: ReactWrapper;

const mockStore = configureStore([]);
const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;
const store = mockStore({
  agreements: {
    agreements: [],
  },
  contacts: {
    contacts: [],
  },
  offlineMutations: {
    data: [],
  },
  user: {
    prefix: 'LH',
  },
  network: {
    online: true,
  },
});

let mockClient: any;
const navigation = {navigate: jest.fn()};
const route: any = {
  params: {
    agreement: AGREEMENT_DETAILS_MOCKDATA,
    contact: CONTACT_DETAILS_MOCKDATA,
  },
};
jest.spyOn(Alert, 'alert');

describe('Agreement Details Page', () => {
  beforeEach(() => {
    mockClient = createMockClient();
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <AgreementDetails navigation={navigation as any} route={route} />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
  });

  it('renders successfully AppHeader.', () => {
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader).toHaveLength(1);
    expect(appHeader.find('Text').contains('Quote LH00013')).toEqual(true);
    expect(appHeader.find('Switch')).toHaveLength(1);
    expect(appHeader.find('Text').contains('Show details')).toBeTruthy();
  });

  it('should render Billing Address section.', () => {
    const billingAddressEle = wrapper
      .find('Memo(AppText)')
      .findWhere((x) => x.text() === 'BILLING ADDRESS')
      .at(0)
      .parents()
      .at(2);
    expect(billingAddressEle.find('TouchableOpacity').contains('Edit')).toEqual(
      true,
    );
    expect(
      billingAddressEle
        .find('Memo(AppText)')
        .contains(AGREEMENT_DETAILS_MOCKDATA.address.line1),
    ).toBeTruthy();
    expect(
      billingAddressEle
        .find('Memo(AppText)')
        .contains(
          `${AGREEMENT_DETAILS_MOCKDATA.address?.city}, ${AGREEMENT_DETAILS_MOCKDATA.address?.us_state}`,
        ),
    ).toBeTruthy();
    expect(
      billingAddressEle
        .find('Memo(AppText)')
        .contains(AGREEMENT_DETAILS_MOCKDATA.address?.postal_code),
    ).toBeTruthy();
  });

  it('should render Project Address section.', () => {
    const projectAddressEle = wrapper
      .find('Memo(AppText)')
      .findWhere((x) => x.text() === 'PROJECT ADDRESS')
      .at(0)
      .parents()
      .at(2);
    expect(projectAddressEle.find('TouchableOpacity').contains('Edit')).toEqual(
      true,
    );
    expect(
      projectAddressEle
        .find('Memo(AppText)')
        .contains(AGREEMENT_DETAILS_MOCKDATA.address.line1),
    ).toBeTruthy();
    expect(
      projectAddressEle
        .find('Memo(AppText)')
        .contains(
          `${AGREEMENT_DETAILS_MOCKDATA.address?.city}, ${AGREEMENT_DETAILS_MOCKDATA.address?.us_state}`,
        ),
    ).toBeTruthy();
    expect(
      projectAddressEle
        .find('Memo(AppText)')
        .contains(AGREEMENT_DETAILS_MOCKDATA.address?.postal_code),
    ).toBeTruthy();
  });

  it('should render Line Items list section.', () => {
    const swipeListEle = wrapper.find('SwipeListView');
    expect(swipeListEle).toHaveLength(1);
    expect(swipeListEle.find('SwipeRow')).toHaveLength(
      AGREEMENT_DETAILS_MOCKDATA.line_items.length,
    );
    const swipeRow = swipeListEle.find('SwipeRow');
    expect(swipeRow.find('Memo(AppText)').contains('Discount')).toBeTruthy();
    expect(swipeRow.find('Memo(AppText)').contains('Delete')).toBeTruthy();
  });

  it('should render Editable "Sales Tax Rate" section.', () => {
    const salesTaxEle = wrapper
      .find('Memo(AppText)')
      .findWhere((x) => x.text() === 'SALES TAX')
      .at(0)
      .parents()
      .at(2);
    expect(salesTaxEle.find('Memo(AppText)').contains('Edit')).toBeTruthy();
  });

  it('should render "continue" button.', () => {
    expect(wrapper.find('TouchableOpacity').contains('CONTINUE')).toBeTruthy();
  });

  it('should render "Create Revision" button.', () => {
    expect(
      wrapper.find('TouchableOpacity').contains('CREATE REVISION'),
    ).toBeTruthy();
  });
});
